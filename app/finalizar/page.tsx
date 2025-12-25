"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../../styles/checkout.module.css";
import { readCart, priceFor, type CartItem } from "../../lib/cart";
import GenerateQuotePdfButton from "../../components/GenerateQuotePdfButton";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerType, setCustomerType] = useState<"avulso" | "regular">("avulso");

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    setItems(readCart());
  }, []);

  const total = useMemo(
    () => items.reduce((acc, it) => acc + priceFor(it, customerType) * it.qty, 0),
    [items, customerType]
  );

  // Trocar depois pelo email real da empresa
  const emailTo = "sales@starpro.com";

  const subject = encodeURIComponent("Pedido / Orçamento - StarPro");

  const body = encodeURIComponent(
    `Olá, equipe StarPro!\n\n` +
      `Segue meu pedido/orçamento.\n\n` +
      `Cliente: ${customer.name || "-"}\n` +
      `Email: ${customer.email || "-"}\n` +
      `Telefone: ${customer.phone || "-"}\n\n` +
      `Tipo de cliente: ${customerType}\n\n` +
      items
        .map((it) => {
          const unit = priceFor(it, customerType);
          return `- ${it.name} (${it.model}) | Qtd: ${it.qty} | Unit: R$ ${unit.toLocaleString("pt-BR")}`;
        })
        .join("\n") +
      `\n\nTotal: R$ ${total.toLocaleString("pt-BR")}\n\n` +
      `Obs: anexei o PDF gerado pelo site.\n`
  );

  const canDownload = items.length > 0;
  const canEmail = customer.email.trim().length > 3; // mínimo

  return (
    <div className="container">
      <h1 className={styles.h1}>Finalizar pedido</h1>
      <p className={styles.p}>
        Revise o pedido, baixe o PDF e envie por email.
      </p>

      <div className={styles.grid}>
        {/* 1) Instruções + Form */}
        <section className={styles.card}>
          <h2 className={styles.h2}>Dados do cliente</h2>

          <div className={styles.form}>
            <label>
              Nome
              <input
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                placeholder="Seu nome"
              />
            </label>

            <label>
              Email
              <input
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                placeholder="seuemail@exemplo.com"
              />
            </label>

            <label>
              Telefone
              <input
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                placeholder="+1 (xxx) xxx-xxxx"
              />
            </label>
          </div>

          <hr className={styles.hr} />

          <h2 className={styles.h2}>Tipo de cliente</h2>
          <div className={styles.segment}>
            <button
              className={customerType === "avulso" ? styles.active : ""}
              onClick={() => setCustomerType("avulso")}
            >
              Avulso
            </button>
            <button
              className={customerType === "regular" ? styles.active : ""}
              onClick={() => setCustomerType("regular")}
            >
              Regular
            </button>
          </div>

          <hr className={styles.hr} />

          <h2 className={styles.h2}>1) Baixar PDF</h2>
          <ol className={styles.ol}>
            <li>Clique em <strong>Baixar PDF</strong>.</li>
            <li>Salve o arquivo no seu computador.</li>
            <li>Anexe o PDF no email no passo 3.</li>
          </ol>

          <div className={styles.actions}>
            <GenerateQuotePdfButton
              items={items}
              customerType={customerType}
              customer={customer}
              className={styles.primaryBtn}
            />
          </div>

          {!canDownload && (
            <p className={styles.warn}>Adicione itens no carrinho para gerar o PDF.</p>
          )}

          <hr className={styles.hr} />

          <h2 className={styles.h2}>3) Enviar por email</h2>
          <ol className={styles.ol}>
            <li>Clique em <strong>Abrir email</strong>.</li>
            <li>Anexe o PDF que você baixou.</li>
            <li>Envie para a StarPro.</li>
          </ol>

          <a
            className={`${styles.emailBtn} ${!canEmail ? styles.disabled : ""}`}
            href={canEmail ? `mailto:${emailTo}?subject=${subject}&body=${body}` : "#"}
            onClick={(e) => {
              if (!canEmail) e.preventDefault();
            }}
          >
            Abrir email
          </a>

          {!canEmail && (
            <p className={styles.warn}>Preencha pelo menos o email para gerar a mensagem.</p>
          )}

          <p className={styles.muted}>
            Destino: <code>{emailTo}</code> (trocar depois pelo email real)
          </p>
        </section>

        {/* 2) Preview */}
        <section className={styles.preview}>
          <div className={styles.paper}>
            <div className={styles.paperHeader}>
              <div>
                <strong>StarPro</strong>
                <div className={styles.paperMuted}>Pedido / Orçamento</div>
              </div>
              <div className={styles.paperMuted}>
                {new Date().toLocaleDateString("pt-BR")}
              </div>
            </div>

            <div className={styles.paperInfo}>
              <div><strong>Cliente:</strong> {customer.name || "-"}</div>
              <div><strong>Email:</strong> {customer.email || "-"}</div>
              <div><strong>Telefone:</strong> {customer.phone || "-"}</div>
              <div><strong>Tipo:</strong> {customerType}</div>
            </div>

            <div className={styles.table}>
              <div className={styles.thead}>
                <span>Produto</span>
                <span>Qtd</span>
                <span>Unit.</span>
                <span>Subtotal</span>
              </div>

              {items.map((it) => {
                const unit = priceFor(it, customerType);
                const sub = unit * it.qty;
                return (
                  <div key={it.slug} className={styles.tr}>
                    <span>
                      <strong>{it.name}</strong>
                      <div className={styles.paperMuted}>{it.model}</div>
                    </span>
                    <span>{it.qty}</span>
                    <span>R$ {unit.toLocaleString("pt-BR")}</span>
                    <span>R$ {sub.toLocaleString("pt-BR")}</span>
                  </div>
                );
              })}

              <div className={styles.tfoot}>
                <span />
                <span />
                <span>Total</span>
                <span>R$ {total.toLocaleString("pt-BR")}</span>
              </div>
            </div>

            <div className={styles.paperFooter}>
              <span className={styles.paperMuted}>
                No MVP, não há pagamento. A equipe confirma por email.
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
