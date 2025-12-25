import type { Product } from "../data/products";

export type CartItem = {
  slug: string;
  name: string;
  model: string;
  price: number;
  regularDiscount: number;
  qty: number;
};

const KEY = "starpro_cart_v1";

function isBrowser() {
  return typeof window !== "undefined";
}

export function readCart(): CartItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart:changed"));
}

export function addToCart(product: Product, qty = 1) {
  const items = readCart();
  const idx = items.findIndex((i) => i.slug === product.slug);

  if (idx >= 0) items[idx] = { ...items[idx], qty: items[idx].qty + qty };
  else {
    items.push({
      slug: product.slug,
      name: product.name,
      model: product.model,
      price: product.price,
      regularDiscount: product.regularDiscount,
      qty,
    });
  }

  writeCart(items);
}

export function removeFromCart(slug: string) {
  const items = readCart().filter((i) => i.slug !== slug);
  writeCart(items);
}

export function updateQty(slug: string, qty: number) {
  const items = readCart().map((i) => (i.slug === slug ? { ...i, qty } : i));
  writeCart(items.filter((i) => i.qty > 0));
}

export function clearCart() {
  writeCart([]);
}

export function priceFor(item: CartItem, customerType: "avulso" | "regular") {
  const base =
    customerType === "regular"
      ? Math.round(item.price * (1 - item.regularDiscount))
      : item.price;

  return base;
}
