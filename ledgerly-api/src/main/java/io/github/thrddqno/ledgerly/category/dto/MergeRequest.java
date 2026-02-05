package io.github.thrddqno.ledgerly.category.dto;

import java.util.List;

public record MergeRequest(
		List<Integer> mergingCategoryIds,
		Integer finalCategoryId
		) {

}
