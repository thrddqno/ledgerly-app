package com.thrddqno.ledgerlyapi.category.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Pattern;

public record UpdateCategoryRequest(
        @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message="Invalid hex color") String color,
        @JsonFormat(shape = JsonFormat.Shape.STRING) String icon,
        String name
) {
}
