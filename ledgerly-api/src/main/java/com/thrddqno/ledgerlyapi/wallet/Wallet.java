package com.thrddqno.ledgerlyapi.wallet;

import com.thrddqno.ledgerlyapi.transaction.Transaction;
import com.thrddqno.ledgerlyapi.transaction.TransactionType;
import com.thrddqno.ledgerlyapi.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "wallets")
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    private String name;

    @Builder.Default
    @Column(nullable = false)
    private BigDecimal startingBalance = BigDecimal.ZERO;

    @Builder.Default
    @Column(nullable = false)
    private BigDecimal cachedTransactions = BigDecimal.ZERO;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    //TODO: add transaction relations for wallets
    //eg. List<Transactions> transactions mapped with transactions...

    public BigDecimal getCurrentBalance(){
        return startingBalance.add(cachedTransactions);
    }

    public void applyTransaction(Transaction transaction){
        BigDecimal amount = transaction.getAmount().abs();

        BigDecimal delta = (transaction.getTransactionType() == TransactionType.EXPENSE) ? amount.negate() : amount;

        this.cachedTransactions = this.cachedTransactions.add(delta);
    }

    public void applyTransfer(Transaction transfer){
        BigDecimal amount = transfer.getAmount().abs();

        BigDecimal delta = (!transfer.isIncoming() ? amount.negate() : amount);

        this.cachedTransactions = this.cachedTransactions.add(delta);
    }

    public void removeTransfer(Transaction transfer){
        BigDecimal amount = transfer.getAmount().abs();

        BigDecimal delta = (!transfer.isIncoming() ? amount : amount.negate());

        this.cachedTransactions = this.cachedTransactions.add(delta);
    }

    public void removeTransaction(Transaction transaction){
        BigDecimal amount = transaction.getAmount().abs();

        BigDecimal delta = (transaction.getTransactionType() == TransactionType.EXPENSE)
                ? amount
                : amount.negate();

        this.cachedTransactions = this.cachedTransactions.add(delta);
    }

}
