"use client";

import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebaseClient";
import styles from "../../styles/login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string>("");
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setIsLogged(!!u));
    return () => unsub();
  }, []);

  async function handleLogin() {
    setStatus("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setStatus("Logged in successfully ✅");
    } catch (e: any) {
      setStatus(e?.message || "Login failed");
    }
  }

  async function handleLogout() {
    setStatus("");
    try {
      await signOut(auth);
      setStatus("Logged out ✅");
    } catch (e: any) {
      setStatus(e?.message || "Logout failed");
    }
  }

  return (
    <div className="container">
      <h1 className={styles.h1}>Login (regular customer)</h1>
      <p className={styles.p}>
        Regular customers log in to see discounted prices.
      </p>

      <div className={styles.card}>
        {isLogged ? (
          <>
            <p className={styles.ok}>You are already logged in.</p>
            <button className={styles.primary} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <label className={styles.label}>
              Email
              <input
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@company.com"
                autoComplete="email"
              />
            </label>

            <label className={styles.label}>
              Password
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>

            <button className={styles.primary} onClick={handleLogin}>
              Login
            </button>
          </>
        )}

        {status && <p className={styles.status}>{status}</p>}
      </div>
    </div>
  );
}