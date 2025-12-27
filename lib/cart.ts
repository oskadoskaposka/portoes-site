import type { Product } from "../data/products";

export type CustomerType = "avulso" | "regular";

export type CartItem = {
  slug: string;
  qty: number;
};

/**
 * Linha “rica” do carrinho (para telas tipo /finalizar),
 * juntando qty + dados do produto.
 */
export type CartLine = {
  slug: string;
  qty: number;
  product: Product;
};

const KEY = "starpro_cart_v1";
const CART_CHANGED_EVENT = "starpro_cart_changed";

function isBrowser() {
  return typeof window !== "undefined";
}

function safeParseJSON<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function emitCartChanged() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(CART_CHANGED_EVENT));
}

/**
 * Lê o carrinho “cru” (slug + qty) do localStorage
 */
export function readCart(): CartItem[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(KEY);
  const parsed = safeParseJSON<CartItem[]>(raw, []);
  // saneamento mínimo
  return (parsed || [])
    .filter((i) => i && typeof i.slug === "string")
    .map((i) => ({
      slug: i.slug,
      qty: typeof i.qty === "number" && i.qty > 0 ? Math.floor(i.qty) : 1,
    }));
}

/**
 * Escreve o carrinho “cru” no localStorage e notifica a UI
 */
export function writeCart(items: CartItem[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  emitCartChanged();
}

/**
 * Limpa carrinho
 */
export function clearCart() {
  writeCart([]);
}

/**
 * Adiciona produto ao carrinho (incrementa qty se já existir)
 */
export function addToCart(product: Product, qty = 1) {
  const q = typeof qty === "number" && qty > 0 ? Math.floor(qty) : 1;

  const cart = readCart();
  const idx = cart.findIndex((i) => i.slug === product.slug);

  if (idx >= 0) {
    cart[idx] = { ...cart[idx], qty: cart[idx].qty + q };
  } else {
    cart.push({ slug: product.slug, qty: q });
  }

  writeCart(cart);
}

/**
 * Remove item pelo slug
 */
export function removeFromCart(slug: string) {
  const cart = readCart().filter((i) => i.slug !== slug);
  writeCart(cart);
}

/**
 * Atualiza quantidade (se qty <= 0 remove)
 */
export function updateQty(slug: string, qty: number) {
  const q = typeof qty === "number" ? Math.floor(qty) : 1;

  if (q <= 0) {
    removeFromCart(slug);
    return;
  }

  const cart = readCart();
  const idx = cart.findIndex((i) => i.slug === slug);

  if (idx >= 0) {
    cart[idx] = { ...cart[idx], qty: q };
    writeCart(cart);
  }
}

/**
 * Converte o carrinho “cru” em linhas com dados do produto.
 * (evita undefined e elimina slugs que não existirem no catálogo)
 */
export function getCartLines(products: Product[]): CartLine[] {
  const cart = readCart();
  const map = new Map(products.map((p) => [p.slug, p]));

  const lines: CartLine[] = [];
  for (const item of cart) {
    const product = map.get(item.slug);
    if (!product) continue;
    lines.push({ slug: item.slug, qty: item.qty, product });
  }
  return lines;
}

/**
 * Preço unitário considerando tipo de cliente.
 * Aceita Product ou um objeto compatível (caso você passe item “rico”).
 */
export function unitPriceFor(
  product: Pick<Product, "price" | "regularDiscount">,
  customerType: CustomerType
) {
  const base =
    customerType === "regular"
      ? Math.round(product.price * (1 - product.regularDiscount))
      : product.price;

  return base;
}

/**
 * Alias para manter compatibilidade com código antigo
 * (ex: GenerateQuotePdfButton importando priceFor).
 */
export function priceFor(
  product: Pick<Product, "price" | "regularDiscount">,
  customerType: CustomerType
) {
  return unitPriceFor(product, customerType);
}

/**
 * Total do carrinho a partir das linhas ricas
 */
export function getCartTotal(lines: CartLine[], customerType: CustomerType) {
  return lines.reduce((sum, l) => sum + unitPriceFor(l.product, customerType) * l.qty, 0);
}

/**
 * Permite páginas (Carrinho/Finalizar) “escutarem” mudanças do carrinho
 */
export function onCartChanged(handler: () => void) {
  if (!isBrowser()) return () => {};
  window.addEventListener(CART_CHANGED_EVENT, handler);
  return () => window.removeEventListener(CART_CHANGED_EVENT, handler);
}

/**
 * Útil pra badge de carrinho no header (se quiser depois)
 */
export function getCartCount() {
  return readCart().reduce((sum, i) => sum + i.qty, 0);
}
