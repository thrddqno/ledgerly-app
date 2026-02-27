package com.thrddqno.ledgerlyapi.category;

import com.thrddqno.ledgerlyapi.transaction.TransactionType;
import com.thrddqno.ledgerlyapi.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {

    Optional<Category> findByUserAndId(User user, UUID id);

    List<Category> findAllByUserAndIdIn(User user, List<UUID> ids);

    List<Category> findAllByUserAndTransactionType(User user, TransactionType transactionType);

    boolean existsByUser(User user);

    Optional<Category> findByUserAndNameAndTransactionType(User user, String name, TransactionType transactionType);

    long countByUserAndTransactionType(User user, TransactionType transactionType);

    List<Category> findAllByUser(User user);
}
