package com.thrddqno.ledgerlyapi.wallet;

import com.thrddqno.ledgerlyapi.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WalletRepository extends JpaRepository<Wallet, UUID> {

    Optional<Wallet> findByUserAndId(User user, UUID id);

    List<Wallet> findByUser(User user);

    List<Wallet> findByUserOrderBySortOrderAsc(User user);

    //MAX SORT ORDER FOR USER
    @Query("SELECT COALESCE(MAX(w.sortOrder), -1) FROM Wallet w WHERE w.user = :user")
    Integer findMaxSortOrderByUser(@Param("user") User user);

    long countByUser(User user);
}
