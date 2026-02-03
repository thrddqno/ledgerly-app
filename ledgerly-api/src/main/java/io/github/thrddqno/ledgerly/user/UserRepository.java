package io.github.thrddqno.ledgerly.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import io.github.thrddqno.ledgerly.domain.models.User;

public interface UserRepository extends JpaRepository<User, Integer>{

}
