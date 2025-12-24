import { products } from "../../../data/products";
import styles from "../../../styles/product.module.css";

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
        <h1>Produto não encontrado</h1>
        <p>Slug recebido: <code>{String(slug)}</code></p>
        <p>Slugs disponíveis: <code>{products.map((p) => p.slug).join(", ")}</code></p>
      </div>
    );
  }

  const regularPrice = Math.round(product.price * (1 - product.regularDiscount));

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
            <span className={styles.muted}>Referência: {product.slug}</span>
          </div>

          <p className={styles.desc}>{product.description}</p>

          <div className={styles.priceBox}>
            <div>
              <div className={styles.label}>Preço avulso</div>
              <div className={styles.price}>
                R$ {product.price.toLocaleString("pt-BR")}
              </div>
            </div>
            <div>
              <div className={styles.label}>Preço cliente regular</div>
              <div className={styles.price}>
                R$ {regularPrice.toLocaleString("pt-BR")}
              </div>
              <div className={styles.mutedSmall}>
                Desconto aplicado: {(product.regularDiscount * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.primary}>Adicionar ao carrinho</button>
            <a className={styles.secondary} href="#contato">
              Pedir orçamento
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
