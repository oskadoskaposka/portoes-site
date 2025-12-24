import Link from "next/link";
import styles from "../styles/home.module.css";

export default function HomePage() {
  return (
    <div className="container">
      <section className={styles.hero}>
        <div>
          <h1 className={styles.h1}>Portões com padrão StarPro.</h1>
          <p className={styles.p}>
            Catálogo organizado, atendimento rápido e modelos sob medida para o seu projeto.
          </p>

          <div className={styles.actions}>
            <Link className={styles.primary} href="/catalogo">
              Ver catálogo
            </Link>
            <a className={styles.secondary} href="#contato">
              Falar com a equipe
            </a>
          </div>

          <div className={styles.stats}>
            <div>
              <strong>Catálogo</strong>
              <span>organizado por modelos</span>
            </div>
            <div>
              <strong>Login</strong>
              <span>cliente avulso/regular</span>
            </div>
            <div>
              <strong>Carrinho</strong>
              <span>sem pagamento (MVP)</span>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelInner}>
            <span className={styles.badge}>MVP</span>
            <h3>Estrutura pronta para evoluir</h3>
            <p className={styles.muted}>
              Agora a gente foca em layout e navegação. Depois pluga login, tipo de cliente e preços.
            </p>
          </div>
        </div>
      </section>

      <section id="contato" className={styles.contact}>
        <h2>Contato</h2>
        <p className={styles.muted}>Deixe seu WhatsApp que a equipe retorna rapidinho.</p>

        <div className={styles.formRow}>
          <input placeholder="Seu nome" />
          <input placeholder="WhatsApp" />
          <button>Enviar</button>
        </div>
      </section>
    </div>
  );
}
