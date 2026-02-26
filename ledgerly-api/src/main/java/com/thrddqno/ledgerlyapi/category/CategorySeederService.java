package com.thrddqno.ledgerlyapi.category;

import com.thrddqno.ledgerlyapi.category.defaults.DefaultCategories;
import com.thrddqno.ledgerlyapi.user.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategorySeederService {

    private final CategoryRepository categoryRepository;

    @Transactional
    public void seedDefaultCategories(User user){
        if (categoryRepository.existsByUser(user)){
            return;
        }

        List<Category> defaults = DefaultCategories.DEFAULT_CATEGORY_LIST.stream().map(
                template -> Category.builder()
                        .color(template.color())
                        .icon(template.icon())
                        .name(template.name())
                        .transactionType(template.transactionType())
                        .user(user)
                        .build()
        ).toList();

        categoryRepository.saveAll(defaults);
    }

}
