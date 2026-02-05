package io.github.thrddqno.ledgerly.transaction;

import java.util.List;
import java.util.UUID;

import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.github.thrddqno.ledgerly.category.Category;
import io.github.thrddqno.ledgerly.category.CategoryRepository;
import io.github.thrddqno.ledgerly.common.exception.ResourceNotFoundException;
import io.github.thrddqno.ledgerly.transaction.dto.TransactionRequest;
import io.github.thrddqno.ledgerly.transaction.dto.TransferRequest;
import io.github.thrddqno.ledgerly.user.User;
import io.github.thrddqno.ledgerly.wallet.Wallet;
import io.github.thrddqno.ledgerly.wallet.WalletRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {

	private final TransactionMapper transactionMapper;
	private final TransactionRepository transactionRepository;
	private final WalletRepository walletRepository;
	private final CategoryRepository categoryRepository;

	/**
	 * GET METHODS
	 */

	public List<TransactionRequest> getTransactionsByWallet(User user, UUID walletPublicId) {
		Wallet wallet = walletRepository.findByUserAndPublicId(user, walletPublicId)
				.orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

		List<Transaction> transactions = transactionRepository.findBySourceWallet(wallet);
		return transactions.stream().map(transactionMapper::toDTO).toList();
	}

	public TransactionRequest getTransaction(User user, UUID walletPublicId, UUID transactionPublicId) {
		Wallet wallet = walletRepository.findByUserAndPublicId(user, walletPublicId)
				.orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

		Transaction transaction = transactionRepository.findBySourceWalletAndPublicId(wallet, transactionPublicId)
				.orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

		return transactionMapper.toDTO(transaction);
	}

	/**
	 * POST METHODS
	 */

	@Transactional
	public TransactionRequest createTransaction(User user, UUID walletPublicId, TransactionRequest request) {
		Wallet wallet = walletRepository.findByUserAndPublicId(user, walletPublicId)
				.orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

		Category category = categoryRepository.findByUserAndId(user, request.categoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		Transaction transaction = Transaction.builder()
				.category(category)
				.sourceWallet(wallet)
				.note(request.note())
				.amount(request.amount())
				.transactionDate(request.transactionDate())
				.type(category.getType())
				.build();

		transactionRepository.save(transaction);

		double delta = transaction.getType() == TransactionType.EXPENSE
				? -transaction.getAmount()
				: transaction.getAmount();

		wallet.setCachedTotalTransactions(wallet.getCachedTotalTransactions() + delta);
		walletRepository.save(wallet);

		return transactionMapper.toDTO(transaction);
	}

	@Transactional
	public List<TransactionRequest> createTransfer(User user, TransferRequest request) throws BadRequestException {
		Wallet sourceWallet = walletRepository.findByUserAndPublicId(user, request.sourceWallet())
				.orElseThrow(() -> new ResourceNotFoundException("Source wallet not found"));
		Wallet destinationWallet = walletRepository.findByUserAndPublicId(user, request.destinationWallet())
				.orElseThrow(() -> new ResourceNotFoundException("Destination wallet not found"));

		if (sourceWallet.getPublicId().equals(destinationWallet.getPublicId())) {
			throw new BadRequestException("Cannot transfer funds to the same wallet");
		}

		UUID transferId = UUID.randomUUID();

		Transaction outgoing = Transaction.builder()
				.transferId(transferId)
				.sourceWallet(sourceWallet)
				.destinationWallet(destinationWallet)
				.category(categoryRepository.findByUserAndName(user, "Outgoing Transfer").orElseThrow())
				.type(TransactionType.EXPENSE)
				.amount(request.amount())
				.note(request.note())
				.transactionDate(request.transactionDate())
				.build();

		Transaction incoming = Transaction.builder()
				.transferId(transferId)
				.sourceWallet(destinationWallet)
				.destinationWallet(sourceWallet)
				.category(categoryRepository.findByUserAndName(user, "Incoming Transfer").orElseThrow())
				.type(TransactionType.INCOME)
				.amount(request.amount())
				.note(request.note())
				.transactionDate(request.transactionDate())
				.build();

		sourceWallet.setCachedTotalTransactions(sourceWallet.getCachedTotalTransactions() - outgoing.getAmount());
		destinationWallet.setCachedTotalTransactions(destinationWallet.getCachedTotalTransactions() + incoming.getAmount());

		walletRepository.saveAll(List.of(sourceWallet, destinationWallet));
		transactionRepository.saveAll(List.of(outgoing, incoming));

		return List.of(outgoing, incoming).stream().map(transactionMapper::toDTO).toList();
	}

	/**
	 * PUT METHODS
	 */

	@Transactional
	public TransactionRequest updateTransaction(User user, UUID walletPublicId, UUID transactionPublicId, TransactionRequest request) {
		Wallet wallet = walletRepository.findByUserAndPublicId(user, walletPublicId)
				.orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

		Transaction transaction = transactionRepository.findBySourceWalletAndPublicId(wallet, transactionPublicId)
				.filter(t -> t.getSourceWallet().getId().equals(wallet.getId()))
				.orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

		// Revert old amount from wallet balance
		double oldDelta = transaction.getType() == TransactionType.EXPENSE
				? -transaction.getAmount()
				: transaction.getAmount();
		wallet.setCachedTotalTransactions(wallet.getCachedTotalTransactions() - oldDelta);

		Category category = categoryRepository.findByUserAndId(user, request.categoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		transaction.setCategory(category);
		transaction.setAmount(request.amount());
		transaction.setNote(request.note());
		transaction.setTransactionDate(request.transactionDate());
		transaction.setType(category.getType());

		transactionRepository.save(transaction);

		// Apply new amount to wallet balance
		double newDelta = transaction.getType() == TransactionType.EXPENSE
				? -transaction.getAmount()
				: transaction.getAmount();
		wallet.setCachedTotalTransactions(wallet.getCachedTotalTransactions() + newDelta);
		walletRepository.save(wallet);

		return transactionMapper.toDTO(transaction);
	}

	@Transactional
	public List<TransactionRequest> updateTransfer(User user, UUID transferId, TransferRequest request) throws BadRequestException {
		List<Transaction> pair = transactionRepository.findByTransferId(transferId);

		if (pair.size() != 2) {
			throw new ResourceNotFoundException("Transfer pair not found");
		}

		// Security check: verify owner of the transfer
		pair.forEach(t -> {
		    if (!t.getSourceWallet().getUser().getId().equals(user.getId())) {
		        throw new RuntimeException();
		    }
		});


		Transaction oldOutgoing = pair.stream()
				.filter(t -> t.getType() == TransactionType.EXPENSE).findFirst().orElseThrow();
		Transaction oldIncoming = pair.stream()
				.filter(t -> t.getType() == TransactionType.INCOME).findFirst().orElseThrow();

		Wallet oldSource = oldOutgoing.getSourceWallet();
		Wallet oldDest = oldOutgoing.getDestinationWallet();

		Wallet newSource = walletRepository.findByUserAndPublicId(user, request.sourceWallet())
				.orElseThrow(() -> new ResourceNotFoundException("New source wallet not found"));
		Wallet newDest = walletRepository.findByUserAndPublicId(user, request.destinationWallet())
				.orElseThrow(() -> new ResourceNotFoundException("New destination wallet not found"));

		if (newSource.getPublicId().equals(newDest.getPublicId())) {
			throw new BadRequestException("Cannot transfer to the same wallet");
		}
		
		oldSource.setCachedTotalTransactions(oldSource.getCachedTotalTransactions() + oldOutgoing.getAmount());
		oldDest.setCachedTotalTransactions(oldDest.getCachedTotalTransactions() - oldIncoming.getAmount());

		double newAmount = request.amount();

		oldOutgoing.setSourceWallet(newSource);
		oldOutgoing.setDestinationWallet(newDest);
		oldOutgoing.setAmount(newAmount);
		oldOutgoing.setNote(request.note());
		oldOutgoing.setTransactionDate(request.transactionDate());

		oldIncoming.setSourceWallet(newDest);
		oldIncoming.setDestinationWallet(newSource);
		oldIncoming.setAmount(newAmount);
		oldIncoming.setNote(request.note());
		oldIncoming.setTransactionDate(request.transactionDate());

		newSource.setCachedTotalTransactions(newSource.getCachedTotalTransactions() - newAmount);
		newDest.setCachedTotalTransactions(newDest.getCachedTotalTransactions() + newAmount);

		walletRepository.saveAll(List.of(oldSource, oldDest, newSource, newDest));
		transactionRepository.saveAll(List.of(oldOutgoing, oldIncoming));

		return List.of(oldOutgoing, oldIncoming).stream().map(transactionMapper::toDTO).toList();
	}

	/**
	 * DELETE METHODS
	 */

	@Transactional
	public void deleteTransaction(User user, UUID walletPublicId, UUID transactionPublicId) {
		Wallet wallet = walletRepository.findByUserAndPublicId(user, walletPublicId)
				.orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

		Transaction transaction = transactionRepository.findBySourceWalletAndPublicId(wallet, transactionPublicId)
				.orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

		double delta = transaction.getType() == TransactionType.EXPENSE
				? -transaction.getAmount()
				: transaction.getAmount();

		wallet.setCachedTotalTransactions(wallet.getCachedTotalTransactions() - delta);
		
		walletRepository.save(wallet);
		transactionRepository.delete(transaction);
	}

	@Transactional
	public void deleteTransfer(User user, UUID transferId) {
		List<Transaction> pair = transactionRepository.findByTransferId(transferId);

		if (pair.size() != 2) {
			throw new ResourceNotFoundException("Transfer pair not found");
		}

		if (!pair.get(0).getSourceWallet().getUser().getId().equals(user.getId())) {
			throw new RuntimeException("Unauthorized: Transfer does not belong to user");
		}

		Transaction outgoing = pair.stream()
				.filter(t -> t.getType() == TransactionType.EXPENSE).findFirst().orElseThrow();
		Transaction incoming = pair.stream()
				.filter(t -> t.getType() == TransactionType.INCOME).findFirst().orElseThrow();

		Wallet sourceWallet = outgoing.getSourceWallet();
		Wallet destWallet = outgoing.getDestinationWallet();

		sourceWallet.setCachedTotalTransactions(sourceWallet.getCachedTotalTransactions() + outgoing.getAmount());
		destWallet.setCachedTotalTransactions(destWallet.getCachedTotalTransactions() - incoming.getAmount());

		walletRepository.saveAll(List.of(sourceWallet, destWallet));
		transactionRepository.deleteAll(pair);
	}
}