package io.github.thrddqno.ledgerly.category;

import org.mapstruct.Mapper;

import io.github.thrddqno.ledgerly.category.dto.CategoryRequest;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
	CategoryRequest toDTO(Category category);
}
