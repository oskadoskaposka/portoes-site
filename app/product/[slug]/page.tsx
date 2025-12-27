import { products } from "../../../data/products";
import styles from "../../../styles/product.module.css";
import AddToCartButton from "../../../components/AddToCartButton";
import ProductPricing from "../../../components/ProductPricing";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

type Params = { slug: string };

export default async function ProductPage({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  const resolved = await params;
  const slug = resolved.slug;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="container">
        <h1>Product not found</h1>
        <p>
          Received slug: <code>{String(slug)}</code>
        </p>
        <p>
          Available slugs: <code>{products.map((p) => p.slug).join(", ")}</code>
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.wrap}>
        <div className={styles.media}>
          <span className={styles.badge}>{product.category}</span>
        </div>

        <div className={styles.info}>
          <h1 className={styles.h1}>{product.name}</h1>
          <div className={styles.meta}>
            <span className={styles.model}>{product.model}</span>
            <span className={styles.dot}>•</span>
            <span className={styles.muted}>SKU: {product.slug}</span>
          </div>

          <p className={styles.desc}>{product.description}</p>

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