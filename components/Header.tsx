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
      // manter simples por enquanto
    }
  }

  return (
    <header className={styles.header}>
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <div className={`${styles.inner} container`}>
          <Link href="/" className={styles.brand} aria-label="StarPro Home">
            <img
              src="/starpro-logo.png"
              alt="StarPro Doors"
              className={styles.logo}
            />
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

            <span className={styles.sep}>|</span>

            <Link className={styles.link} href="/cart">
              View Cart
            </Link>
          </div>
        </div>
      </div>

      {/* NAV BAR */}
      <div className={styles.navBar}>
        <div className={`${styles.inner} container`}>
          <nav className={styles.nav} aria-label="Primary navigation">
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
