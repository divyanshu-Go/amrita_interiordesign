export function generateOrderNumber() {
  const prefix = "ORD";

  // Base36 timestamp (short & sortable-ish)
  const timePart = Date.now().toString(36).toUpperCase();

  // Random 4–5 chars
  const randomPart = Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase();

  return `${prefix}-${timePart}-${randomPart}`;
}
