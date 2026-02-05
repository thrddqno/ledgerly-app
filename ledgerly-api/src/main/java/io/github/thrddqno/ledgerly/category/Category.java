package io.github.thrddqno.ledgerly.category;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import io.github.thrddqno.ledgerly.transaction.Transaction;
import io.github.thrddqno.ledgerly.transaction.TransactionType;
import io.github.thrddqno.ledgerly.user.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "categories")
public class Category {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Pattern(
		    regexp = "^#([A-Fa-f0-9]{6})$",
		    message = "Color must be a valid hex code"
		)
	@Column(length = 7, nullable = false)
	private String color;
	
	@Enumerated(EnumType.STRING)
	private CategoryIcon icon;
	
	private String name;
	
	@Enumerated(EnumType.STRING)
	private TransactionType type;
	
	@CreationTimestamp
	@Column(updatable = false)
	private LocalDateTime createdAt;
	
	@OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
	List<Transaction> transactions;
	
	@ManyToOne
	@JoinColumn(name="user_id")
	private User user;
}
