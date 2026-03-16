export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP', //todo: add a way to change currency either through localStorage or user settings.
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)
}
