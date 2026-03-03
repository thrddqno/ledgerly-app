export const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2, // Added to ensure consistent rounding
    }).format(amount)
}
