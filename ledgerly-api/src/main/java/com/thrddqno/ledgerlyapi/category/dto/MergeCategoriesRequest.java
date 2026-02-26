package com.thrddqno.ledgerlyapi.category.dto;

import java.util.List;
import java.util.UUID;

public record MergeCategoriesRequest(
        List<UUID> mergingCategoryIds,
        UUID finalCategoryId
) {
}
