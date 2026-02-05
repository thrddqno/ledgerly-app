package io.github.thrddqno.ledgerly.category.defaults;

import io.github.thrddqno.ledgerly.category.CategoryIcon;
import io.github.thrddqno.ledgerly.transaction.TransactionType;

public record DefaultCategoryTemplate(
		CategoryIcon icon,
        String color,
        String name,
        TransactionType type) {

}
