package com.thrddqno.ledgerlyapi.common.security.auth;

import com.thrddqno.ledgerlyapi.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    void deleteAllByUserAndExpiresAtBefore(User user, Instant now);
}
