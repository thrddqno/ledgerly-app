package io.github.thrddqno.ledgerly.wallet;

import java.time.LocalDateTime;
import java.util.Currency;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import io.github.thrddqno.ledgerly.transaction.Transaction;
import io.github.thrddqno.ledgerly.user.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "wallets")
public class Wallet {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(nullable = false, unique = true, updatable = false)
    private UUID publicId;
	
	@PrePersist
    void generatePublicId() {
        this.publicId = UUID.randomUUID();
    }
	
	@NotNull
	private String name;
	
	@NotNull
	private double startingBalance;
	
	@NotNull
	private double cachedTotalTransactions;

	
	@NotNull
	private String currencyCode;
	
	@CreationTimestamp
	@Column(updatable = false)
	private LocalDateTime createdAt;
	
	@ManyToOne
	@JoinColumn(name="user_id")
	private User user;
	
	@OneToMany(mappedBy = "wallet", cascade = CascadeType.ALL)
	private List<Transaction> transactions;

	
	public double getCurrentBalance() {
	    return startingBalance + cachedTotalTransactions;
	}

}
