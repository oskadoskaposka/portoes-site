"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebaseClient";
import styles from "../styles/header.module.css";

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setIsLogged(!!u));
    return () => unsub();
  }, []);

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch {
      // silencioso por enquanto (UX depois)
    }
  }

  return (
    <header className={styles.header}>
      {/* TOP BAR (dark) */}
      <div className={styles.topBar}>
        <div className={`${styles.inner} container`}>
          <Link href="/" className={styles.brand} aria-label="StarPro Home">
            <span className={styles.brandMark} aria-hidden="true">
              ★
            </span>
            <span className={styles.brandText}>
              <span className={styles.brandName}>StarPro</span>
              <span className={styles.brandTag}>Gates</span>
            </span>
          </Link>

          <div className={styles.topLinks}>
            {isLogged ? (
              <button type="button" className={styles.linkBtn} onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link className={styles.link} href="/login">
                Login
              </Link>
            )}

            <span className={styles.sep} aria-hidden="true">
              |
            </span>

            <Link className={styles.link} href="/cart">
              View Cart
            </Link>
          </div>
        </div>
      </div>

      {/* NAV BAR (blue) */}
      <div className={styles.navBar}>
        <div className={`${styles.inner} container`}>
          <nav className={styles.nav} aria-label="Primary">
            <Link href="/catalog" className={styles.navItem}>
              CATEGORIES
            </Link>
            <Link href="/catalog" className={styles.navItem}>
              MANUFACTURERS
            </Link>
            <Link href="/catalog" className={styles.navItem}>
              INDUSTRIES
            </Link>
            <Link href="/catalog" className={styles.navItem}>
              SPECIALS
            </Link>
            <Link href="/catalog" className={styles.navItem}>
              RESOURCE CENTER
            </Link>
            <Link href="/catalog" className={styles.navItem}>
              CONTACT US
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
