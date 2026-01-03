"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../../styles/cart.module.css";
import {
  clearCart,
  getCartLines,
  getCartTotal,
  onCartChanged,
  removeFromCart,
  updateQty,
  unitPriceFor,
  type CartLine,
} from "../../lib/cart";
import { useCustomerType } from "../../lib/session";

import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { app } from "../../lib/firebaseClient";

type Product = {
  slug: string;
  name: string;
  series: string;
  model?: string;
  price: number;
  currency?: string;
  active: boolean;
  sortOrder?: number;
  images?: string[];
  features?: string[];
  category?: string;
  regularDiscount?: number;
};

export default function CartPage() {
  const customerType = useCustomerType();
  const [tick, setTick] = useState(0);

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Re-render when cart changes (add/remove/update/clear)
  useEffect(() => {
    const unsub = onCartChanged(() => setTick((x) => x + 1));
    return unsub;
  }, []);

  // Load products from Firestore (same idea as catalog)
  useEffect(() => {
    (async () => {
      try {
        setLoadingProducts(true);
        setProductsError(null);

        const db = getFirestore(app);
        const col = collection(db, "products");
        const q = query(col, where("active", "==", true), orderBy("sortOrder", "asc"));

        const snap = await getDocs(q);
        const list: Product[] = snap.docs.map((d) => {
          const data = d.data() as any;

          return {
            slug: data.slug ?? d.id,
            name: data.name ?? d.id,
            series: data.series ?? "Other",
            model: data.model ?? "",
            price: Number(data.price ?? 0),
            currency: data.currency ?? "CAD",
            active: Boolean(data.active ?? true),
            sortOrder: Number(data.sortOrder ?? 9999),
            images: Array.isArray(data.images) ? data.images : [],
            features: Array.isArray(data.features) ? data.features : [],
            // defaults p/ compat com pricing/types
            category: data.category ?? data.series ?? "General",
            regularDiscount: Number(data.regularDiscount ?? 0),
          };
        });

        list.sort(
          (a, b) =>
            (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999) ||
            (a.name ?? "").localeCompare(b.name ?? "")
        );

        setProducts(list);
      } catch (e: any) {
        setProductsError(e?.message ?? "Failed to load products.");
      } finally {
        setLoadingProducts(false);
      }
    })();
  }, []);

  const lines: CartLine[] = useMemo(() => {
    void tick;
    return getCartLines(products as any);
  }, [tick, products]);

  const total = useMemo(() => getCartTotal(lines, customerType), [lines, customerType]);

  return (
    <div className="container">
      <h1 className={styles.h1}>Cart</h1>
      <p className={styles.p}>
        No payment in the MVP — here you organize your order and send it to our team.
      </p>

      <div className={styles.toolbar}>
        <button className={styles.ghost} onClick={() => clearCart()}>
          Clear cart
        </button>
      </div>

      {productsError ? (
        <div className={styles.empty}>
          <strong>Couldn’t load products.</strong>
          <span>{productsError}</span>
        </div>
      ) : loadingProducts ? (
        <div className={styles.empty}>
          <strong>Loading…</strong>
          <span>Fetching products to render your cart.</span>
        </div>
      ) : lines.length === 0 ? (
        <div className={styles.empty}>
          <strong>Your cart is empty.</strong>
          <span>Go back to the catalog and add a model.</span>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {lines.map((line) => {
              const unit = unitPriceFor(line.product, customerType);

              return (
                <div key={line.slug} className={styles.row}>
                  <div className={styles.left}>
                    <strong>{line.product.name}</strong>
                    <span className={styles.muted}>{line.product.model}</span>
                    <span className={styles.muted}>
                      Unit:{" "}
                      {unit.toLocaleString("en-CA", {
                        style: "currency",
                        currency: (line.product as any).currency ?? "CAD",
                      })}
                    </span>
                  </div>

                  <div className={styles.right}>
                    <input
                      className={styles.qty}
                      type="number"
                      min={1}
                      value={line.qty}
                      onChange={(e) => updateQty(line.slug, Number(e.target.value || 1))}
                    />

                    <div className={styles.sub}>
                      {(unit * line.qty).toLocaleString("en-CA", {
                        style: "currency",
                        currency: (line.product as any).currency ?? "CAD",
                      })}
                    </div>

                    <button className={styles.remove} onClick={() => removeFromCart(line.slug)}>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.summary}>
            <div>
              <div className={styles.muted}>Total</div>
              <div className={styles.total}>
                {total.toLocaleString("en-CA", {
                  style: "currency",
                  currency: "CAD",
                })}
              </div>
            </div>

            <a className={styles.primary} href="/checkout">
              Checkout
            </a>
          </div>
        </>
      )}
    </div>
  );
}
