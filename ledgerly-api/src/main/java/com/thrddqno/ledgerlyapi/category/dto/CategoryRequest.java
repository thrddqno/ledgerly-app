package com.thrddqno.ledgerlyapi.category.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.thrddqno.ledgerlyapi.transaction.TransactionType;
import jakarta.validation.constraints.Pattern;

public record CategoryRequest(
        @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message="Invalid hex color") String color,
        @JsonFormat(shape = JsonFormat.Shape.STRING) String icon,
        String name,
        @JsonFormat(shape = JsonFormat.Shape.STRING) TransactionType transactionType
) {
}
