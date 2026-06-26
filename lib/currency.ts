/**
 * Format number as Cambodian Riel (រៀល)
 * Example: 1234567 -> "1,234,567 រៀល"
 */
export function formatRiel(amount: number): string {
  return new Intl.NumberFormat('km-KH', {
    style: 'currency',
    currency: 'KHR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('KHR', 'រៀល').trim();
}

/**
 * Format number with commas
 * Example: 1234567 -> "1,234,567"
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('km-KH');
}
