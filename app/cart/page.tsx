"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../../styles/cart.module.css";
import { products } from "../../data/products";
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

export default function CartPage() {
  const customerType = useCustomerType();
  const [tick, setTick] = useState(0);

  // Re-render when cart changes (add/remove/update/clear)
  useEffect(() => {
    const unsub = onCartChanged(() => setTick((x) => x + 1));
    return unsub;
  }, []);

  const lines: CartLine[] = useMemo(() => {
    void tick;
    return getCartLines(products);
  }, [tick]);

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

      {lines.length === 0 ? (
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
                      Unit: {unit.toLocaleString("en-US", { style: "currency", currency: "USD" })}
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
                        { (unit * line.qty).toLocaleString("en-US", { style: "currency", currency: "USD" }) }
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
                { total.toLocaleString("en-US", { style: "currency", currency: "USD" }) }
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