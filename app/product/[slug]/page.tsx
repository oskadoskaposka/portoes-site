"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../../lib/firebaseClient";

import styles from "../../../styles/product.module.css";
import AddToCartButton from "../../../components/AddToCartButton";
import ProductPricing from "../../../components/ProductPricing";

type Product = {
  slug: string;
  name: string;
  series?: string;
  model?: string;
  description?: string;
  price?: number;
  currency?: string;
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string | undefined;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        const db = getFirestore(app);
        const ref = doc(db, "products", slug);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          router.replace("/404");
          return;
        }

        setProduct({
          slug,
          ...(snap.data() as any),
        });
      } catch (e) {
        console.error("Failed to load product", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, router]);

  if (loading) {
    return <div className="container">Loading product…</div>;
  }

  if (!product) {
    return <div className="container">Product not found.</div>;
  }

  return (
    <div className="container">
      <div className={styles.wrap}>
        <div className={styles.media}>
          {product.series && (
            <span className={styles.badge}>{product.series}</span>
          )}
        </div>

        <div className={styles.info}>
          <h1 className={styles.h1}>{product.name}</h1>

          <div className={styles.meta}>
            {product.model && (
              <>
                <span className={styles.model}>{product.model}</span>
                <span className={styles.dot}>•</span>
              </>
            )}
            <span className={styles.muted}>SKU: {product.slug}</span>
          </div>

          {product.description && (
            <p className={styles.desc}>{product.description}</p>
          )}

          <ProductPricing product={product} />

          <div className={styles.actions}>
            <AddToCartButton product={product} className={styles.primary} />
            <a className={styles.secondary} href="#contact">
              Request quote
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
