 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebaseClient";
import styles from "../styles/header.module.css";

/**
 * Site header with top bar (brand, login/cart) and primary navigation.
 * Navigation links were updated to include Home, Catalog, About, Contact
 * and Services pages. When the user is logged in, a Logout button is
 * displayed instead of the Login link.
 */
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
      // ignore for now; handle UX later
    }
  }

  return (
    <header className={styles.header}>
      {/* Top bar with brand and login/cart links */}
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
              <button
                type="button"
                className={styles.linkBtn}
                onClick={handleLogout}
              >
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

      {/* Primary navigation bar */}
      <div className={styles.navBar}>
        <div className={`${styles.inner} container`}>
          <nav className={styles.nav} aria-label="Primary">
            <Link href="/" className={styles.navItem}>
              HOME
            </Link>
            <Link href="/catalog" className={styles.navItem}>
              CATALOG
            </Link>
            <Link href="/about" className={styles.navItem}>
              ABOUT
            </Link>
            <Link href="/contact" className={styles.navItem}>
              CONTACT
            </Link>
            <Link href="/services" className={styles.navItem}>
              SERVICES
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}