package com.thrddqno.ledgerlyapi.category.defaults;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.thrddqno.ledgerlyapi.transaction.TransactionType;
import jakarta.validation.constraints.Pattern;

public record DefaultCategoryTemplate(
        @JsonFormat(shape = JsonFormat.Shape.STRING) String icon,
        @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message="Invalid hex color") String color,
        String name,
        @JsonFormat(shape = JsonFormat.Shape.STRING) TransactionType transactionType
) {


}
