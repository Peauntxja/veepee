export function formatPrice(value: number): string {
  return (
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) ?? `${value.toFixed(2).replace(".", ",")} €`
  );
}
