package com.thrddqno.ledgerlyapi.category.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.thrddqno.ledgerlyapi.transaction.TransactionType;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public record CategoryResponse(
        UUID id,
        @JsonFormat(shape = JsonFormat.Shape.STRING) String color,
        @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message="Invalid hex color") String icon,
        String name,
        @JsonFormat(shape = JsonFormat.Shape.STRING) TransactionType transactionType
) {
}
