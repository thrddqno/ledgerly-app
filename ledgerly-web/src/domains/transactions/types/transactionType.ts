export const TransactionType = {
    INCOME: 'INCOME',
    EXPENSE: 'EXPENSE',
    TRANSFER: 'TRANSFER',
} as const

export type TransactionType =
    (typeof TransactionType)[keyof typeof TransactionType]

export type ModifiableTransactionType =
    | typeof TransactionType.INCOME
    | typeof TransactionType.EXPENSE
