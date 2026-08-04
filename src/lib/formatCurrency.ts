// Cached Intl.NumberFormat instance for optimal performance
const formattersCache: Record<string, Intl.NumberFormat> = {};

function getFormatter(currency: string = 'USD', locale: string = 'en-US'): Intl.NumberFormat {
  const cacheKey = `${locale}_${currency}`;
  if (!formattersCache[cacheKey]) {
    formattersCache[cacheKey] = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    });
  }
  return formattersCache[cacheKey];
}

export function formatCurrency(
  amount: number | string | null | undefined,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  if (amount === null || amount === undefined) {
    return '$0';
  }

  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) {
    return '$0';
  }

  try {
    return getFormatter(currency, locale).format(num);
  } catch (err) {
    console.warn('formatCurrency error, fallback used:', err);
    return `$${num.toLocaleString('en-US')}`;
  }
}
