package com.thrddqno.ledgerlyapi.category.defaults;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CategoryIcon {
    // Transport & Travel
    GAS("fa-solid fa-gas-pump"),
    CAR("fa-solid fa-car"),
    PARKING("fa-solid fa-square-parking"),
    PLANE("fa-solid fa-plane-departure"),
    MOTOR("fa-solid fa-motorcycle"),

    // Food & Lifestyle
    FOOD("fa-solid fa-utensils"),
    COFFEE("fa-solid fa-mug-hot"), // Added: High frequency expense
    SHOPPING("fa-solid fa-bag-shopping"),
    CART("fa-solid fa-cart-shopping"),
    GIFT("fa-solid fa-gift"),
    GAME("fa-solid fa-gamepad"),
    ENTERTAINMENT("fa-solid fa-masks-theater"),

    // Health & Personal
    HEALTH("fa-solid fa-suitcase-medical"),
    BEAUTY("fa-solid fa-sparkles"), // Updated: Better representation for beauty/care
    PERSON("fa-solid fa-user"),
    SMOKING("fa-solid fa-smoking"),

    // Home & Utilities
    HOUSE("fa-solid fa-house"),
    ENERGY("fa-solid fa-bolt"),
    WATER("fa-solid fa-droplet"), // Added: Essential utility
    TOOLS("fa-solid fa-screwdriver-wrench"),
    BOOK("fa-solid fa-book"),

    // Finance & Work
    CASH("fa-solid fa-money-bills"),
    CASH_BAG("fa-solid fa-sack-dollar"),
    CARD("fa-solid fa-credit-card"),
    BANK("fa-solid fa-landmark"),
    SAVINGS("fa-solid fa-piggy-bank"), // Added: Critical for a ledger
    SUBSCRIPTION("fa-solid fa-calendar-check"), // Added: Modern recurring expense
    SHIELD("fa-solid fa-shield-halved"),
    TAG("fa-solid fa-tag"),

    // Misc
    TRANSFER("fa-solid fa-right-left"),
    QUESTION_MARK("fa-solid fa-circle-question");

    private final String cssClass;
}
