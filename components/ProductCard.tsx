import Link from "next/link";
import { Product } from "../data/products";
import styles from "../styles/product-card.module.css";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/produto/${product.slug}`} className={styles.card}>
      <div className={styles.media}>
        <span className={styles.badge}>{product.category}</span>
      </div>

      <div className={styles.body}>
        <strong>{product.name}</strong>
        <span className={styles.model}>{product.model}</span>
        <p className={styles.desc}>{product.description}</p>
      </div>
    </Link>
  );
}
