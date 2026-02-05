package io.github.thrddqno.ledgerly.category;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import io.github.thrddqno.ledgerly.category.dto.CategoryRequest;
import io.github.thrddqno.ledgerly.transaction.TransactionRepository;
import io.github.thrddqno.ledgerly.transaction.TransactionType;
import io.github.thrddqno.ledgerly.user.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

	
	private final CategoryMapper categoryMapper;
	private final CategoryRepository categoryRepository;
	private final TransactionRepository transactionRepository;
	
	/**
	 * GET METHODS FOR CATEGORIES
	 */
	
	// getAllByUser
	public List<CategoryRequest> getAllCategories(User user){
		List<Category> categories = categoryRepository.findByUser(user);
		return categories.stream().map(categoryMapper::toDTO).toList();
 	}
	
	// all categories for user of a specific type
	public List<CategoryRequest> getCategoriesByType(User user, TransactionType type){
		List<Category> categories = categoryRepository.findByUserAndType(user, type);
		return categories.stream().map(categoryMapper::toDTO).toList();
	}
	
	// get by id
	public CategoryRequest getCategoryById(User user, Integer categoryId) {
		return categoryMapper.toDTO(categoryRepository.findByUserAndId(user, categoryId).orElseThrow());
	}
	
	/**
	 * POST METHODS FOR CATEGORIES
	 */

	public CategoryRequest createCategory(User user, CategoryRequest categoryDTO) {
		Category category = Category.builder()
				.color(categoryDTO.color())
				.icon(categoryDTO.icon())
				.name(categoryDTO.name())
				.type(categoryDTO.type())
				.user(user)
				.build();
		categoryRepository.save(category);
		return categoryMapper.toDTO(category);
	}
	
	/**
	 * PUT METHODS FOR CATEGORIES
	 */
	
	public CategoryRequest updateCategory(User user, Integer categoryId, CategoryRequest categoryDTO) {
		Category category = categoryRepository.findByUserAndId(user, categoryId).orElseThrow();
		
		category.setColor(categoryDTO.color());
		category.setIcon(categoryDTO.icon());
		category.setName(categoryDTO.name());
		category.setType(categoryDTO.type());
		categoryRepository.save(category);
		return categoryMapper.toDTO(category);
	}
	
	//mergeCategories and set final category merged
	@Transactional
	public CategoryRequest mergeCategories(User user, List<Integer> mergingCategoryIds, Integer finalCategoryId) {
		//fetch final category
		Category finalCategory = categoryRepository.findByUserAndId(user, finalCategoryId).orElseThrow();
	
		//fetch all mergingcategories
		List<Category> mergingCategories = categoryRepository.findAllById(mergingCategoryIds);
		
		mergingCategories.removeIf(c -> c.getId().equals(finalCategoryId));
		
		transactionRepository.reassignTransactions(finalCategory, mergingCategories);
		
		categoryRepository.deleteAll(mergingCategories);
		return categoryMapper.toDTO(finalCategory);
	}
	
	
	/**
	 * DELETE METHODS FOR CATEGORIES
	 */
	
	public void deleteCategory(User user, Integer categoryId) {
		Category category = categoryRepository.findByUserAndId(user, categoryId).orElseThrow();
		
		if(!category.getTransactions().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete categories with transactions");
		}
		
		categoryRepository.delete(category);
	}
	
	public void deleteCategory(User user, Integer categoryId, Integer targetCategoryId) {
		Category category = categoryRepository.findByUserAndId(user, categoryId).orElseThrow();
		
		Category target = categoryRepository.findByUserAndId(user, targetCategoryId).orElseThrow();
		
		transactionRepository.reassignTransactions(category, List.of(target));
		
		categoryRepository.delete(category);
	}

}
