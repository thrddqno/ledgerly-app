package com.thrddqno.ledgerlyapi.category;

import com.thrddqno.ledgerlyapi.transaction.TransactionType;
import com.thrddqno.ledgerlyapi.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6})$",
    message = "Color must be a valid hex code")
    @NotNull
    private String color;

    @NotNull
    private String icon;

    @NotNull
    private String name;

    @Enumerated(EnumType.STRING)
    @NotNull
    private TransactionType transactionType;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
