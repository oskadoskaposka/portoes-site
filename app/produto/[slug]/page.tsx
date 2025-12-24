import { products } from "../../../data/products";
import styles from "../../../styles/product.module.css";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return (
      <div className="container">
        <h1>Produto não encontrado</h1>
        <p style={{ color: "rgba(255,255,255,.65)" }}>
          Verifique o link e tente novamente.
        </p>
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
              <div className={styles.price}>R$ {product.price.toLocaleString("pt-BR")}</div>
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

      <div id="contato" className={styles.contact}>
        <h2>Contato rápido</h2>
        <p className={styles.muted}>
          No MVP, o pedido não tem pagamento. A gente registra e a equipe retorna.
        </p>
        <div className={styles.formRow}>
          <input placeholder="Seu nome" />
          <input placeholder="WhatsApp" />
          <button>Enviar</button>
        </div>
      </div>
    </div>
  );
}
