package io.github.thrddqno.ledgerly.wallet;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import io.github.thrddqno.ledgerly.user.User;

public interface WalletRepository extends JpaRepository<Wallet, Integer> {
	
	Optional<List<Wallet>> findByUser(User user);
	
	Optional<Wallet> findByPublicId(UUID publicId);
	
	Optional<Wallet> findByUserAndPublicId(User user, UUID publicId);
}
