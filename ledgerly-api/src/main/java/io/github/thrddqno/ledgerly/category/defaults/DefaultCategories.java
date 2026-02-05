package io.github.thrddqno.ledgerly.category.defaults;

import java.util.List;

import io.github.thrddqno.ledgerly.category.CategoryIcon;
import io.github.thrddqno.ledgerly.transaction.TransactionType;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class DefaultCategories {
	
	public static final List<DefaultCategoryTemplate> DEFAULTS = List.of(
			//INCOMES
			new DefaultCategoryTemplate(CategoryIcon.CASH, "#72C541", "Extra Income", TransactionType.INCOME),
			new DefaultCategoryTemplate(CategoryIcon.SHIELD, "#45A7E6", "Insurance Payout", TransactionType.INCOME),
			new DefaultCategoryTemplate(CategoryIcon.GIFT, "#18B272", "Gifts", TransactionType.INCOME),
			new DefaultCategoryTemplate(CategoryIcon.BANK, "#E06476", "Loan", TransactionType.INCOME),
			new DefaultCategoryTemplate(CategoryIcon.CASH, "#18B272", "Salary", TransactionType.INCOME),
			new DefaultCategoryTemplate(CategoryIcon.CASH_BAG, "#FFA200", "Business", TransactionType.INCOME),
			new DefaultCategoryTemplate(CategoryIcon.QUESTION_MARK, "#67686C", "Other", TransactionType.INCOME),
			
			//EXPENSES
			new DefaultCategoryTemplate(CategoryIcon.BEAUTY, "#7944D0", "Self Care", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.CASH, "#5EC4AC", "Bills", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.CAR, "#45A7E6", "Car", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.CARD, "#F5534B", "Debt", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.BOOK, "#3A75AD", "Education", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.ENTERTAINMENT, "#FFA801", "Entertainment", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.PERSON, "#45A7E6", "Family & Personal", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.FOOD, "#45A7E6", "Food & Drink", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.FOOD, "#F5534B", "Outside Food", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.GAS, "#FCCE00", "Transport", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.BANK, "#659DD6", "Government", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.CART, "#DD8138", "Groceries", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.HEALTH, "#E06476", "Healthcare", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.HOUSE, "#B6985C", "Home", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.QUESTION_MARK, "#67686C", "Others", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.SHOPPING, "#E36AEF", "Shopping", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.GAME, "#67686C", "Sports & Hobbies", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.PLANE, "#F964A0", "Travel", TransactionType.EXPENSE),
			new DefaultCategoryTemplate(CategoryIcon.CASH, "#67686C", "Work", TransactionType.EXPENSE)
			);
}
