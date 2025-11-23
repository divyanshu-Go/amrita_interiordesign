// Simple text-shortener
export function truncate(text, max = 40) {
  if (!text) return "";
  return text.length > max ? text.substring(0, max) + "..." : text;
}