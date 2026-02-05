package io.github.thrddqno.ledgerly.category.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import io.github.thrddqno.ledgerly.category.CategoryIcon;
import io.github.thrddqno.ledgerly.transaction.TransactionType;
import jakarta.validation.constraints.Pattern;

public record CategoryRequest(
		@JsonFormat(shape = JsonFormat.Shape.STRING) CategoryIcon icon,
		@Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message="Invalid hex color") String color,
		String name,
		@JsonFormat(shape = JsonFormat.Shape.STRING) TransactionType type
		) {
}
