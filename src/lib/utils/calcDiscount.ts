export function calcDiscountPercent(price: number, originalPrice: number): number {
  if (originalPrice <= 0) {
    return 0;
  }
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
