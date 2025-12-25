"use client";

import { useEffect, useState } from "react";
import {
  getCustomerType,
  setCustomerType,
  type CustomerType,
} from "../lib/session";
import Link from "next/link";
import styles from "../styles/header.module.css";

export default function Header() {
  const [customerTypeState, setCustomerTypeState] =
    useState<CustomerType>("avulso");

  useEffect(() => {
    const sync = () => setCustomerTypeState(getCustomerType());
    sync();
    window.addEventListener("customer:changed", sync);
    return () => window.removeEventListener("customer:changed", sync);
  }, []);

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
          <button
            type="button"
            onClick={() => {
              if (customerTypeState === "avulso") setCustomerType("regular");
              else setCustomerType("avulso");
            }}
            className={styles.loginBtn}
          >
            {customerTypeState === "avulso" ? "Entrar" : "Sair"}
          </button>

          <Link href="/carrinho" className={styles.cta}>
            Carrinho
          </Link>
        </nav>
      </div>
    </header>
  );
}
