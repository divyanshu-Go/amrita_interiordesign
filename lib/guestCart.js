// lib/guestCart.js
// Guest cart lives entirely in localStorage.
// Shape: { items: [{ productId, quantity, sellBy }] }

const KEY = "interio97_guest_cart";

function read() {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function write(cart) {
  try {
    localStorage.setItem(KEY, JSON.stringify(cart));
  } catch {
    // localStorage blocked (private mode etc.) — silently ignore
  }
}

export function getGuestCart() {

  console.log("[getGuestCart] ENTRY Reading guest cart from localStorage");
  return read();
}

export function addToGuestCart(productId, quantity = 1, sellBy = "piece") {
  const cart = read();
  const existing = cart.items.find((i) => i.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, sellBy });
  }

  write(cart);
  return cart;
}

export function updateGuestCartItem(productId, quantity) {
  const cart = read();
  const item = cart.items.find((i) => i.productId === productId);
  if (item) item.quantity = quantity;
  write(cart);
  return cart;
}

export function removeFromGuestCart(productId) {
  const cart = read();
  cart.items = cart.items.filter((i) => i.productId !== productId);
  write(cart);
  return cart;
}

export function clearGuestCart() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

export function getGuestCartCount() {
  return read().items.reduce((sum, i) => sum + i.quantity, 0);
}