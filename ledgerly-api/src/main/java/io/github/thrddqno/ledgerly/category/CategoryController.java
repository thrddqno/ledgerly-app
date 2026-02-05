package io.github.thrddqno.ledgerly.category;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.github.thrddqno.ledgerly.category.dto.CategoryRequest;
import io.github.thrddqno.ledgerly.category.dto.MergeRequest;
import io.github.thrddqno.ledgerly.transaction.TransactionType;
import io.github.thrddqno.ledgerly.user.User;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
	
	private final CategoryService categoryService;
	
	/**
	 * GET ENDPOINTS FOR CATEGORIES
	 */

	//get categories
	@GetMapping
	public ResponseEntity<List<CategoryRequest>> getCategories(@AuthenticationPrincipal User user, @RequestParam(required = false) TransactionType type){
		if (type == null) {
	        return ResponseEntity.ok(categoryService.getAllCategories(user));
	    }
	    return ResponseEntity.ok(categoryService.getCategoriesByType(user, type));
	}
	
	// get a single category by id
	@GetMapping("/{id}")
	public ResponseEntity<CategoryRequest> getCategory(@AuthenticationPrincipal User user, @PathVariable Integer id){
		return ResponseEntity.ok(categoryService.getCategoryById(user, id));
	}
	
	/**
	 * POST ENDPOINTS FOR CATEGORIES
	 */
	
	// create category
	@PostMapping
	public ResponseEntity<CategoryRequest> createCategory(@AuthenticationPrincipal User user, @RequestBody CategoryRequest categoryDTO){
		return ResponseEntity.ok(categoryService.createCategory(user, categoryDTO));
	}
	
	// merge list of category to one category
	@PostMapping("/merge")
	public ResponseEntity<CategoryRequest> mergeCategoriesToCategory(@AuthenticationPrincipal User user, @RequestBody MergeRequest request){
		return ResponseEntity.ok(categoryService.mergeCategories(user, request.mergingCategoryIds(), request.finalCategoryId()));
	}
	
	/**
	 * PUT ENDPOINTS FOR CATEGORIES
	 */
	
	//ipdate an existing category
	@PutMapping("/{id}")
	public ResponseEntity<CategoryRequest> updateCategory(@AuthenticationPrincipal User user, @PathVariable Integer id, @RequestBody CategoryRequest categoryDTO){
		return ResponseEntity.ok(categoryService.updateCategory(user, id, categoryDTO));
	}
	
	/**
	 * DELETE ENDPOINTS FOR CATEGORIES
	 */
	
	//delete a category 
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteCategory(@AuthenticationPrincipal User user,@PathVariable Integer id, @RequestParam(required = false) Integer moveTo) {
		if (moveTo == null) {
	        categoryService.deleteCategory(user, id);
	    } else {
	        categoryService.deleteCategory(user, id, moveTo);
	    }
		return ResponseEntity.noContent().build();
	}

}
