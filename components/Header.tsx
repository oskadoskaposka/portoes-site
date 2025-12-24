import Link from "next/link";
import styles from "../styles/header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <span className={styles.logo}>★</span>
          <span>
            <strong>StarPro</strong>
            <span className={styles.tag}>Portões</span>
          </span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/catalogo">Catálogo</Link>
          <Link href="/login">Login</Link>
          <Link href="/carrinho" className={styles.cta}>Carrinho</Link>
        </nav>
      </div>
    </header>
  );
}
