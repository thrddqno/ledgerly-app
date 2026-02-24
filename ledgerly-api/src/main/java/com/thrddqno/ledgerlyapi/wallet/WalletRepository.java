package com.thrddqno.ledgerlyapi.wallet;

import com.thrddqno.ledgerlyapi.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WalletRepository extends JpaRepository<Wallet, UUID> {

    Optional<Wallet> findByUserAndId(User user, UUID id);

    List<Wallet> findByUser(User user);

    long countByUser(User user);
}
