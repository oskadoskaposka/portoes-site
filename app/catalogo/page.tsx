import { products } from "../../data/products";
import ProductCard from "../../components/ProductCard";
import styles from "../../styles/catalog.module.css";

export default function CatalogPage() {
  return (
    <div className="container">
      <h1 className={styles.h1}>Catálogo de Portões</h1>
      <p className={styles.p}>
        Modelos disponíveis organizados por categoria.
      </p>

      <div className={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
