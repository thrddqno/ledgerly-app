package com.thrddqno.ledgerlyapi;

import com.thrddqno.ledgerlyapi.category.Category;
import com.thrddqno.ledgerlyapi.category.CategoryMapper;
import com.thrddqno.ledgerlyapi.category.CategoryRepository;
import com.thrddqno.ledgerlyapi.category.CategoryService;
import com.thrddqno.ledgerlyapi.category.dto.*;
import com.thrddqno.ledgerlyapi.transaction.TransactionRepository;
import com.thrddqno.ledgerlyapi.transaction.TransactionType;
import com.thrddqno.ledgerlyapi.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock private CategoryRepository categoryRepository;
    @Mock private CategoryMapper categoryMapper;
    @Mock private TransactionRepository transactionRepository;

    @InjectMocks
    private CategoryService categoryService;

    private User testUser;
    private UUID categoryId;

    @BeforeEach
    void setUp() {
        testUser = new User();
        categoryId = UUID.randomUUID();
    }

    @Nested
    @DisplayName("Create Category Tests")
    class CreateCategory {

        @Test
        @DisplayName("Should create category when valid request")
        void create_Success() {
            CategoryRequest request = new CategoryRequest("Food", "fa-pizza", "#FF0000", TransactionType.EXPENSE);
            when(categoryRepository.countByUserAndTransactionType(testUser, TransactionType.EXPENSE)).thenReturn(5L);

            categoryService.createCategory(testUser, request);

            verify(categoryRepository).save(any(Category.class));
        }

        @Test
        @DisplayName("Should throw exception when creating TRANSFER type")
        void create_Fail_Transfer() {
            CategoryRequest request = new CategoryRequest("Trans", "icon", "color", TransactionType.TRANSFER);

            assertThatThrownBy(() -> categoryService.createCategory(testUser, request))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Users cannot create transfer categories");
        }

        @Test
        @DisplayName("Should throw exception when income limit reached")
        void create_Fail_Limit() {
            CategoryRequest request = new CategoryRequest("Job", "icon", "color", TransactionType.INCOME);
            when(categoryRepository.countByUserAndTransactionType(testUser, TransactionType.INCOME)).thenReturn(10L);

            assertThatThrownBy(() -> categoryService.createCategory(testUser, request))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Maximum INCOME categories reached");
        }
    }

    @Nested
    @DisplayName("Merge Category Tests")
    class MergeCategories {

        @Test
        @DisplayName("Should merge categories and delete sources")
        void merge_Success() {
            UUID finalId = UUID.randomUUID();
            UUID sourceId = UUID.randomUUID();
            Category finalCat = Category.builder().id(finalId).transactionType(TransactionType.EXPENSE).build();
            Category sourceCat = Category.builder().id(sourceId).transactionType(TransactionType.EXPENSE).build();

            MergeCategoriesRequest request = new MergeCategoriesRequest(List.of(sourceId), finalId);

            when(categoryRepository.findByUserAndId(testUser, finalId)).thenReturn(Optional.of(finalCat));
            when(categoryRepository.findAllByUserAndIdIn(testUser, List.of(sourceId))).thenReturn(List.of(sourceCat));

            categoryService.mergeCategories(testUser, request);

            verify(transactionRepository).reassignTransactions(finalCat, List.of(sourceCat));
            verify(categoryRepository).deleteAll(anyList());
        }

        @Test
        @DisplayName("Should fail when merging different transaction types")
        void merge_Fail_TypeMismatch() {
            UUID finalId = UUID.randomUUID();
            UUID sourceId = UUID.randomUUID();
            Category finalCat = Category.builder().id(finalId).transactionType(TransactionType.INCOME).build();
            Category sourceCat = Category.builder().id(sourceId).transactionType(TransactionType.EXPENSE).build();

            MergeCategoriesRequest request = new MergeCategoriesRequest(List.of(sourceId), finalId);

            when(categoryRepository.findByUserAndId(testUser, finalId)).thenReturn(Optional.of(finalCat));
            when(categoryRepository.findAllByUserAndIdIn(testUser, List.of(sourceId))).thenReturn(List.of(sourceCat));

            assertThatThrownBy(() -> categoryService.mergeCategories(testUser, request))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Mismatched Transaction Types");
        }
    }

    @Nested
    @DisplayName("Delete Category Tests")
    class DeleteCategory {

        @Test
        @DisplayName("Should perform salvage delete (reassign before delete)")
        void delete_Salvage_Success() {
            UUID targetId = UUID.randomUUID();
            Category source = Category.builder().id(categoryId).transactionType(TransactionType.EXPENSE).build();
            Category target = Category.builder().id(targetId).transactionType(TransactionType.EXPENSE).build();

            when(categoryRepository.findByUserAndId(testUser, categoryId)).thenReturn(Optional.of(source));
            when(categoryRepository.findByUserAndId(testUser, targetId)).thenReturn(Optional.of(target));

            categoryService.deleteCategory(testUser, categoryId, targetId);

            verify(transactionRepository).reassignTransactions(source, List.of(target));
            verify(categoryRepository).delete(source);
        }

        @Test
        @DisplayName("Should fail to delete if category belongs to another user")
        void delete_Security_Fail() {
            when(categoryRepository.findByUserAndId(testUser, categoryId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> categoryService.deleteCategory(testUser, categoryId))
                    .isInstanceOf(NoSuchElementException.class);
        }
    }
}