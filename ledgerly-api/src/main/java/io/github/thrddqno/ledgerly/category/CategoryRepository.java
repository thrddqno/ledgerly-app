package io.github.thrddqno.ledgerly.category;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import io.github.thrddqno.ledgerly.transaction.TransactionType;
import io.github.thrddqno.ledgerly.user.User;

public interface CategoryRepository extends JpaRepository<Category, Integer>{
	
	// all categories for user of a specific type
	List<Category> findByUserAndType(User user, TransactionType type);
	
	// all category for a user
	List<Category> findByUser(User user);
	
	// specific category for a user
	Optional<Category> findByUserAndId(User user, Integer id);
	
	//ownership checker
	boolean existsByIdAndUser(Integer id, User user);
}
