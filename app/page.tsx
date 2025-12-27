import Link from "next/link";
import styles from "../styles/home.module.css";

export default function HomePage() {
  return (
    <div className="container">
      <section className={styles.hero}>
        <div>
          <h1 className={styles.h1}>StarPro gates done right.</h1>
          <p className={styles.p}>
            Organized catalog, responsive service and custom models for your project.
          </p>

          <div className={styles.actions}>
            <Link className={styles.primary} href="/catalog">
              View catalog
            </Link>
            <a className={styles.secondary} href="#contact">
              Contact our team
            </a>
          </div>

          <div className={styles.stats}>
            <div>
              <strong>Catalog</strong>
              <span>organized by models</span>
            </div>
            <div>
              <strong>Login</strong>
              <span>retail / regular customer</span>
            </div>
            <div>
              <strong>Cart</strong>
              <span>no payment (MVP)</span>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelInner}>
            <span className={styles.badge}>MVP</span>
            <h3>Ready to evolve</h3>
            <p className={styles.muted}>
              We focus on layout and navigation now. Later we plug in login, customer types and pricing.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className={styles.contact}>
        <h2>Contact</h2>
        <p className={styles.muted}>
          Leave your phone number and our team will get back to you shortly.
        </p>

        <div className={styles.formRow}>
          <input placeholder="Your name" />
          <input placeholder="Phone" />
          <button>Send</button>
        </div>
      </section>
    </div>
  );
}