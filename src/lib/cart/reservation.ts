const RESERVATION_MS = 15 * 60 * 1000;

export function formatReservationCountdown(expiresAt: number | null): string | null {
  if (!expiresAt) return null;
  const diff = expiresAt - Date.now();
  if (diff <= 0) return null;
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function getNextReservationExpiry(current: number | null): number {
  if (current && current > Date.now()) {
    return current;
  }
  return Date.now() + RESERVATION_MS;
}

export { RESERVATION_MS };
