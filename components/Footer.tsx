import styles from "../styles/footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.row}>
          <strong>StarPro</strong>
          <span className={styles.small}>© {new Date().getFullYear()} • Catálogo e atendimento</span>
        </div>
      </div>
    </footer>
  );
}
