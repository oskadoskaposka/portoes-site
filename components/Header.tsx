"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebaseClient";
import styles from "../styles/header.module.css";

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsLogged(!!user);
    });
    return () => unsub();
  }, []);

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout error:", e);
    }
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <span className={styles.logo}>★</span>
          <span>
            <strong>StarPro</strong>
            <span className={styles.tag}>Gates</span>
          </span>
        </Link>

        <nav className={styles.nav}>
        <Link href="/catalog">Catalog</Link>

          {isLogged ? (
            <button
              type="button"
              onClick={handleLogout}
              className={styles.loginBtn}
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className={styles.loginBtn}>
              Login
            </Link>
          )}

          <Link href="/cart" className={styles.cta}>
            Cart
          </Link>
        </nav>
      </div>
    </header>
  );
}
