 import Link from "next/link";
 import styles from "../styles/footer.module.css";

/**
 * Site footer displaying multiple columns of links and a dark bottom bar.
 * Columns: Customer Service, About StarPro, Products, and Follow. The
 * bottom bar shows a copyright notice and a note about accepted payment methods.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div className={styles.column}>
          <h4 className={styles.title}>Customer Service</h4>
          <Link href="/contact" className={styles.link}>
            Contact Us
          </Link>
          <Link href="/services" className={styles.link}>
            Services
          </Link>
        </div>
        <div className={styles.column}>
          <h4 className={styles.title}>About StarPro</h4>
          <Link href="/about" className={styles.link}>
            About Us
          </Link>
          <Link href="/" className={styles.link}>
            Home
          </Link>
        </div>
        <div className={styles.column}>
          <h4 className={styles.title}>Products</h4>
          <Link href="/services/homeowners" className={styles.link}>
            For Home Owners
          </Link>
          <Link href="/services/business" className={styles.link}>
            For Businesses
          </Link>
        </div>
        <div className={styles.column}>
          <h4 className={styles.title}>Follow</h4>
          {/* External links open in a new tab */}
          <a
            href="https://www.facebook.com"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <a
            href="https://www.youtube.com"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube
          </a>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.bottomContent}>
          <div className={styles.bottomLeft}>© {year} StarPro Doors</div>
          <div className={styles.bottomRight}>We accept major credit cards</div>
        </div>
      </div>
    </footer>
  );
 }