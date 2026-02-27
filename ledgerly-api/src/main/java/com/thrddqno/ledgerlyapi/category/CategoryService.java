package com.thrddqno.ledgerlyapi.category;

import com.thrddqno.ledgerlyapi.category.dto.*;
import com.thrddqno.ledgerlyapi.common.exception.BusinessValidationException;
import com.thrddqno.ledgerlyapi.common.exception.ResourceNotFoundException;
import com.thrddqno.ledgerlyapi.transaction.TransactionRepository;
import com.thrddqno.ledgerlyapi.transaction.TransactionType;
import com.thrddqno.ledgerlyapi.user.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    private static final int MAX_INCOME_CATEGORY_PER_USER = 10;
    private static final int MAX_EXPENSES_CATEGORY_PER_USER = 30;
    private final TransactionRepository transactionRepository;

    private void validateCategoryLimit(User user, TransactionType transactionType){
        long count = categoryRepository.countByUserAndTransactionType(user, transactionType);
        int limit = (transactionType == TransactionType.INCOME) ? MAX_INCOME_CATEGORY_PER_USER : MAX_EXPENSES_CATEGORY_PER_USER;
        if (count >= limit){
            throw new BusinessValidationException(
                    "Maximum " + transactionType + " categories reached.",
                    "CATEGORY_LIMIT_REACHED",
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    private void validateTransactionType(Category category, Category target){
        if (category.getTransactionType() != target.getTransactionType()){
            throw new BusinessValidationException(
                    "Source is " + category.getTransactionType() + "  but Target is " + target.getTransactionType(),
                    "TRANSACTION_TYPE_MISMATCH",
                    HttpStatus.BAD_REQUEST);
        }
    }

    private void validateNotTransfer(TransactionType type) {
        if (type == TransactionType.TRANSFER) {
            throw new BusinessValidationException(
                    "Operation not allowed for Transfer type categories.",
                    "INVALID_CATEGORY_OPERATION",
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    /**
     * GET METHODS
     */

    @Transactional
    public FormattedCategoryResponse getCategories(User user){
        List<Category> categories = categoryRepository.findAllByUser(user);

        Map<TransactionType, List<CategoryResponse>> categoriesGrouped = categories.stream()
                .collect(Collectors.groupingBy(
                        Category::getTransactionType,
                        Collectors.mapping(categoryMapper::toCategoryResponse, Collectors.toList())
                ));

        return categoryMapper.toFormattedCategoryResponse(
                categoriesGrouped.getOrDefault(TransactionType.INCOME, List.of()),
                categoriesGrouped.getOrDefault(TransactionType.EXPENSE, List.of()),
                categoriesGrouped.getOrDefault(TransactionType.TRANSFER, List.of())
        );
    }

    @Transactional
    public List<CategoryResponse> getCategoryByType(User user, TransactionType transactionType){
        List<Category> categories = categoryRepository.findAllByUserAndTransactionType(user, transactionType);
        return categories.stream().map(categoryMapper::toCategoryResponse).toList();
    }

    @Transactional
    public CategoryResponse getCategory(User user, UUID categoryId){
        Category category = categoryRepository.findByUserAndId(user, categoryId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Category could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND
                )
        );
        return categoryMapper.toCategoryResponse(category);
    }

    /**
     * POST METHODS
     */
    @Transactional
    public CategoryResponse createCategory(User user, CategoryRequest request){

        validateNotTransfer(request.transactionType());
        validateCategoryLimit(user,request.transactionType());

        Category category = Category.builder()
                .color(request.color())
                .icon(request.icon())
                .name(request.name())
                .transactionType(request.transactionType())
                .user(user)
                .build();
        categoryRepository.save(category);

        return categoryMapper.toCategoryResponse(category);
    }

    @Transactional
    public CategoryResponse updateCategory(User user, UUID categoryId, UpdateCategoryRequest request){
        Category category = categoryRepository.findByUserAndId(user, categoryId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Category could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND
                )
        );

        validateNotTransfer(category.getTransactionType());

        category.setName(request.name());
        category.setIcon(request.icon());
        category.setColor(request.color());

        categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(category);
    }

    @Transactional
    public CategoryResponse mergeCategories(User user, MergeCategoriesRequest request){
        Category finalCategory = categoryRepository.findByUserAndId(user, request.finalCategoryId()).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Category could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND
                )
        );

        validateNotTransfer(finalCategory.getTransactionType());

        List<Category> mergingCategories = categoryRepository.findAllByUserAndIdIn(user, request.mergingCategoryIds());

        if (mergingCategories.size() != request.mergingCategoryIds().size()){
            throw new ResourceNotFoundException(
                    "One or more categories could not be found",
                    "RESOURCE_NOT_FOUND",
                    HttpStatus.NOT_FOUND
            );
        }

        mergingCategories.removeIf(c -> c.getId().equals(finalCategory.getId()));
        mergingCategories.forEach(source -> validateNotTransfer(source.getTransactionType()));
        mergingCategories.forEach(source -> validateTransactionType(source, finalCategory));

        transactionRepository.reassignTransactions(finalCategory,mergingCategories);
        categoryRepository.deleteAll(mergingCategories);

        return categoryMapper.toCategoryResponse(finalCategory);
    }
    
    @Transactional
    public void deleteCategory(User user, UUID categoryId){
        Category category = categoryRepository.findByUserAndId(user, categoryId).orElseThrow( () -> new ResourceNotFoundException(
                "Category could not be found",
                "RESOURCE_NOT_FOUND",
                HttpStatus.NOT_FOUND
        ));
        validateNotTransfer(category.getTransactionType());
        //CRUCIAL: CASCADE usually fails, delete all category if user insists migration to other categories won't be necessary/
        transactionRepository.deleteByCategory(category);
        categoryRepository.delete(category);
    }

    /**
     * If user wants to salvage the transactions when deleting a category,
     * user will then be prompted or required to set a target category to where the transaction will be put.
     */
    @Transactional
    public void deleteCategory(User user, UUID categoryId, UUID targetCategoryId){
        Category category = categoryRepository.findByUserAndId(user, categoryId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Source Category could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND
                )
        );
        Category target = categoryRepository.findByUserAndId(user, targetCategoryId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Target Category could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND
                )
        );

        validateNotTransfer(category.getTransactionType());
        validateNotTransfer(target.getTransactionType());

        validateTransactionType(category, target);

        //List.of because reassignTransactions need a list on the second param List<Category> targetCategories
        transactionRepository.reassignTransactions(category, List.of(target));

        categoryRepository.delete(category);
    }

}
