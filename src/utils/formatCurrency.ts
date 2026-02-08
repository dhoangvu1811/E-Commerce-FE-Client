export const formatCurrency = (amount: number | string | undefined): string => {
  if (amount === undefined || amount === null) {
    return '0 đ'
  }

  const value = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(value)) {
    return '0 đ'
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}
