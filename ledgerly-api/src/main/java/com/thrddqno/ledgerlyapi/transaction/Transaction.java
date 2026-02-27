package com.thrddqno.ledgerlyapi.transaction;

import com.thrddqno.ledgerlyapi.category.Category;
import com.thrddqno.ledgerlyapi.wallet.Wallet;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    private UUID id;

    private String notes;

    @NotNull
    private BigDecimal amount;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // TRANSFER //

    private UUID transferId;

    /**
     * If this is a transfer, populate this to the other half of the transfer
     * eg: WALLET_A is the receiving end of the transfer, then will populate the WALLET_B transaction id
     */

    @OneToOne
    @JoinColumn(name = "related_transaction_id", nullable = true)
    private Transaction relatedTransaction;

    private boolean isIncoming;

    public boolean isTransfer(){
        return this.transferId != null;
    }



}
