package com.thrddqno.ledgerlyapi.transaction;

import com.thrddqno.ledgerlyapi.category.Category;
import com.thrddqno.ledgerlyapi.wallet.Wallet;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    Optional<Transaction> findByWalletAndId(Wallet wallet, UUID id);

    //migrate transactions to other category
    @Modifying
    @Transactional
    @Query("UPDATE Transaction tx set tx.category = :category WHERE tx.category IN :targetCategories")
    int reassignTransactions(@Param("category") Category category, @Param("targetCategories") List<Category> targetCategories);

    /**
     * KEYSET PAGINATION
     * TODO: Create Keyset Pagination Query
     */

    //normal pagination
    Page<Transaction> findAllByWallet(Wallet wallet, Pageable pageable);

    void deleteByCategory(Category category);

    @Modifying
    @Query("DELETE FROM Transaction t WHERE t.wallet = :wallet")
    void deleteAllByWallet(Wallet wallet);
}
