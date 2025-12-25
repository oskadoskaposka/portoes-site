"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../../styles/cart.module.css";
import {
  clearCart,
  readCart,
  removeFromCart,
  updateQty,
  priceFor,
  type CartItem,
} from "../../lib/cart";
import { getCustomerType, type CustomerType } from "../../lib/session";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerType, setCustomerType] = useState<CustomerType>("avulso");

  useEffect(() => {
    const refresh = () => setItems(readCart());
    refresh();
    window.addEventListener("cart:changed", refresh);
    return () => window.removeEventListener("cart:changed", refresh);
  }, []);

  useEffect(() => {
    const sync = () => setCustomerType(getCustomerType());
    sync();
    window.addEventListener("customer:changed", sync);
    return () => window.removeEventListener("customer:changed", sync);
  }, []);

  const total = useMemo(() => {
    return items.reduce(
      (acc, it) => acc + priceFor(it, customerType) * it.qty,
      0
    );
  }, [items, customerType]);

  return (
    <div className="container">
      <h1 className={styles.h1}>Carrinho</h1>
      <p className={styles.p}>
        Sem pagamento no MVP — aqui você organiza o pedido e envia para
        atendimento.
      </p>

      <div className={styles.toolbar}>
        <button className={styles.ghost} onClick={() => clearCart()}>
          Limpar carrinho
        </button>
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <strong>Seu carrinho está vazio.</strong>
          <span>Volte ao catálogo e adicione um modelo.</span>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {items.map((it) => {
              const unit = priceFor(it, customerType);
              return (
                <div key={it.slug} className={styles.row}>
                  <div className={styles.left}>
                    <strong>{it.name}</strong>
                    <span className={styles.muted}>{it.model}</span>
                    <span className={styles.muted}>
                      Unitário: R$ {unit.toLocaleString("pt-BR")}
                    </span>
                  </div>

                  <div className={styles.right}>
                    <input
                      className={styles.qty}
                      type="number"
                      min={1}
                      value={it.qty}
                      onChange={(e) =>
                        updateQty(it.slug, Number(e.target.value || 1))
                      }
                    />
                    <div className={styles.sub}>
                      R$ {(unit * it.qty).toLocaleString("pt-BR")}
                    </div>
                    <button
                      className={styles.remove}
                      onClick={() => removeFromCart(it.slug)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.summary}>
            <div>
              <div className={styles.muted}>Total</div>
              <div className={styles.total}>
                R$ {total.toLocaleString("pt-BR")}
              </div>
            </div>

            <a className={styles.primary} href="/finalizar">
              Finalizar pedido
            </a>
          </div>
        </>
      )}
    </div>
  );
}
