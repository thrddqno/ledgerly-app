package com.thrddqno.ledgerlyapi.category.dto;

import java.util.List;

public record FormattedCategoryResponse(
        List<CategoryResponse> income,
        List<CategoryResponse> expenses,
        List<CategoryResponse> transfer
) {
}
