package com.thrddqno.ledgerlyapi.transaction;

import com.thrddqno.ledgerlyapi.user.User;
import com.thrddqno.ledgerlyapi.wallet.Wallet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    Optional<Transaction> findByWalletAndId(Wallet wallet, UUID id);

    /**
     * KEYSET PAGINATION
     * TODO: Create Keyset Pagination Query
     */

    //normal pagination
    Page<Transaction> findAllByWallet(Wallet wallet, Pageable pageable);

}
