package io.github.thrddqno.ledgerly.category;

import org.mapstruct.Mapper;

import io.github.thrddqno.ledgerly.category.dto.CategoryDTO;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
	CategoryDTO toDTO(Category category);
}
