import { products } from "../../data/products";
import ProductCard from "../../components/ProductCard";
import styles from "../../styles/catalog.module.css";

export default function CatalogPage() {
  return (
    <div className="container">
      <h1 className={styles.h1}>Gate Catalog</h1>
      <p className={styles.p}>Available models organized by category.</p>

      <div className={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}