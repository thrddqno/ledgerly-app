package io.github.thrddqno.ledgerly.transaction;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import io.github.thrddqno.ledgerly.category.Category;
import jakarta.transaction.Transactional;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
	
	//create bulk migration of categories
	@Modifying
    @Transactional
    @Query("UPDATE Transaction t SET t.category = :finalCategory WHERE t.category IN :sourceCategories")
    int reassignTransactions(@Param("finalCategory") Category finalCategory,
                             @Param("sourceCategories") List<Category> sourceCategories);
}
