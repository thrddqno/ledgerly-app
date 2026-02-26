package com.thrddqno.ledgerlyapi.category;

import com.thrddqno.ledgerlyapi.category.dto.*;
import com.thrddqno.ledgerlyapi.transaction.TransactionType;
import com.thrddqno.ledgerlyapi.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<FormattedCategoryResponse> getCategories(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(categoryService.getCategories(user));
    }

    @GetMapping("/type/{transactionType}")
    public ResponseEntity<List<CategoryResponse>> getCategoryByType(@AuthenticationPrincipal User user, @PathVariable TransactionType transactionType){
        return ResponseEntity.ok(categoryService.getCategoryByType(user, transactionType));
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryResponse> getCategory(@AuthenticationPrincipal User user, @PathVariable UUID categoryId){
        return ResponseEntity.ok(categoryService.getCategory(user,categoryId));
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(@AuthenticationPrincipal User user, @RequestBody CategoryRequest request){
        return ResponseEntity.ok(categoryService.createCategory(user,request));
    }

    @PostMapping("/merge")
    public ResponseEntity<CategoryResponse> mergeCategories(@AuthenticationPrincipal User user, @RequestBody MergeCategoriesRequest request){
        return ResponseEntity.ok(categoryService.mergeCategories(user,request));
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryResponse> updateCategories(@AuthenticationPrincipal User user, @PathVariable UUID categoryId, @RequestBody UpdateCategoryRequest request){
        return ResponseEntity.ok(categoryService.updateCategory(user,categoryId,request));
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@AuthenticationPrincipal User user, @PathVariable UUID categoryId){
        categoryService.deleteCategory(user,categoryId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{categoryId}/move/{targetCategoryId}")
    public ResponseEntity<Void> deleteCategory(@AuthenticationPrincipal User user, @PathVariable UUID categoryId, @PathVariable UUID targetCategoryId){
        categoryService.deleteCategory(user,categoryId,targetCategoryId);
        return ResponseEntity.noContent().build();
    }

}
