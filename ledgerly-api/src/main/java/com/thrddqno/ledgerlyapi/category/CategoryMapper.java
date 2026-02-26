package com.thrddqno.ledgerlyapi.category;

import com.thrddqno.ledgerlyapi.category.dto.CategoryResponse;
import com.thrddqno.ledgerlyapi.category.dto.FormattedCategoryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toCategoryResponse(Category category);

    FormattedCategoryResponse toFormattedCategoryResponse(List<CategoryResponse> income, List<CategoryResponse> expenses, List<CategoryResponse> transfer);
}
