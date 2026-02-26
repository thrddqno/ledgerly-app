package com.thrddqno.ledgerlyapi.category.defaults;

import com.thrddqno.ledgerlyapi.transaction.TransactionType;
import lombok.NoArgsConstructor;

import java.util.List;


@NoArgsConstructor
public class DefaultCategories {

    private static DefaultCategoryTemplate income(String icon, String color, String name) {
        return new DefaultCategoryTemplate(icon, color, name, TransactionType.INCOME);
    }

    private static DefaultCategoryTemplate expense(String icon, String color, String name) {
        return new DefaultCategoryTemplate(icon, color, name, TransactionType.EXPENSE);
    }

    private static DefaultCategoryTemplate transfer(String icon, String color, String name) {
        return new DefaultCategoryTemplate(icon, color, name, TransactionType.TRANSFER);
    }

    public static final List<DefaultCategoryTemplate> DEFAULT_CATEGORY_LIST = List.of(
      //INCOME
            income(CategoryIcon.CASH.getCssClass(),        "#72C541", "Extra Income"),
            income(CategoryIcon.SHIELD.getCssClass(),      "#45A7E6", "Insurance Payout"),
            income(CategoryIcon.GIFT.getCssClass(),        "#18B272", "Gifts"),
            income(CategoryIcon.BANK.getCssClass(),        "#E06476", "Loan"),
            income(CategoryIcon.CASH.getCssClass(),        "#18B272", "Salary"),
            income(CategoryIcon.CASH_BAG.getCssClass(),    "#FFA200", "Business"),
            income(CategoryIcon.QUESTION_MARK.getCssClass(),"#67686C", "Other"),

      //EXPENSES
            expense(CategoryIcon.BEAUTY.getCssClass(),     "#7944D0", "Self Care"),
            expense(CategoryIcon.CASH.getCssClass(),       "#5EC4AC", "Bills"),
            expense(CategoryIcon.CAR.getCssClass(),        "#45A7E6", "Car"),
            expense(CategoryIcon.CARD.getCssClass(),       "#F5534B", "Debt"),
            expense(CategoryIcon.BOOK.getCssClass(),       "#3A75AD", "Education"),
            expense(CategoryIcon.ENTERTAINMENT.getCssClass(),"#FFA801", "Entertainment"),
            expense(CategoryIcon.PERSON.getCssClass(),     "#45A7E6", "Family & Personal"),
            expense(CategoryIcon.FOOD.getCssClass(),       "#45A7E6", "Food & Drink"),
            expense(CategoryIcon.FOOD.getCssClass(),       "#F5534B", "Outside Food"),
            expense(CategoryIcon.GAS.getCssClass(),        "#FCCE00", "Transport"),
            expense(CategoryIcon.BANK.getCssClass(),       "#659DD6", "Government"),
            expense(CategoryIcon.CART.getCssClass(),       "#DD8138", "Groceries"),
            expense(CategoryIcon.HEALTH.getCssClass(),     "#E06476", "Healthcare"),
            expense(CategoryIcon.HOUSE.getCssClass(),      "#B6985C", "Home"),
            expense(CategoryIcon.QUESTION_MARK.getCssClass(),"#67686C", "Others"),
            expense(CategoryIcon.SHOPPING.getCssClass(),   "#E36AEF", "Shopping"),
            expense(CategoryIcon.GAME.getCssClass(),       "#67686C", "Sports & Hobbies"),
            expense(CategoryIcon.PLANE.getCssClass(),      "#F964A0", "Travel"),
            expense(CategoryIcon.CASH.getCssClass(),       "#67686C", "Work"),

            //TRANSFER
            transfer(CategoryIcon.TRANSFER.getCssClass(),   "#F5534B", "Outgoing Transfer"),
            transfer(CategoryIcon.TRANSFER.getCssClass(),    "#18B272", "Incoming Transfer")
    );

}
