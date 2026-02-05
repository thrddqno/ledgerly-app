package io.github.thrddqno.ledgerly.category;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CategoryIcon {
	GAS("gas-pump"),
	CAR("car"),
	PARKING("square-parking"),
	PLANE("plane-departure"),
	TAG("tag"),
	FOOD("utensils"),
	SMOKING("smoking"),
	PERSON("user"),
	BOOK("book"),
	CASH("money-bills"),
	GAME("gamepad"),
	ENTERTAINMENT("masks-theater"),
	TOOLS("screwdriver-wrench"),
	HOUSE("house"),
	MOTOR("motorcycle"),
	ENERGY("bolt"),
	SHOPPING("bag-shopping"),
	BEAUTY("hands-holding-child"),
	HEALTH("suitcase-medical"),
	CARD("credit-card"),
	SHIELD("shield-halved"),
	GIFT("gift"),
	BANK("landmark"),
	CASH_BAG("sack-dollar"),
	QUESTION_MARK("circle-question"),
	CART("cart-shopping"),
	TRANSFER("right-left");
	
	private final String cssClass;
}
