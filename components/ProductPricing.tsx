"use client";

import type { Product } from "../data/products";
import { useCustomerType } from "../lib/session";
import styles from "../styles/product.module.css";

export default function ProductPricing({ product }: { product: Product }) {
  const customerType = useCustomerType();

  if (customerType === "regular") {
    const discounted = Math.round(product.price * (1 - product.regularDiscount));
    return (
      <div className={styles.priceBox}>
        <div>
          <div className={styles.label}>Price (regular customer)</div>
          <div className={styles.price}>
            {discounted.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </div>
          <div className={styles.mutedSmall}>
            You are logged in — discount applied automatically.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.priceBox}>
      <div>
        <div className={styles.label}>Price</div>
        <div className={styles.price}>
          {product.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}
        </div>
        <div className={styles.mutedSmall}>
          Regular customer? Click <strong>Login</strong> to see your discount.
        </div>
      </div>
    </div>
  );
}
