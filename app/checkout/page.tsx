"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../../styles/checkout.module.css";
import { products } from "../../data/products";
import {
  getCartLines,
  getCartTotal,
  onCartChanged,
  unitPriceFor,
  type CartLine,
  type CustomerType as CartCustomerType,
} from "../../lib/cart";
import { useCustomerType } from "../../lib/session";
import GenerateQuotePdfButton from "../../components/GenerateQuotePdfButton";

export default function CheckoutPage() {
  const customerType = useCustomerType();

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [mounted, setMounted] = useState(false);
  const [dateStr, setDateStr] = useState<string>("");
  const [cartLines, setCartLines] = useState<CartLine[] | undefined>([]);

  useEffect(() => {
    setMounted(true);
    setDateStr(new Date().toLocaleDateString("en-US"));

    try {
      const lines = getCartLines(products);
      setCartLines(Array.isArray(lines) ? lines : []);
    } catch {
      setCartLines([]);
    }

    const unsub = onCartChanged(() => {
      try {
        const lines = getCartLines(products);
        setCartLines(Array.isArray(lines) ? lines : []);
      } catch {
        setCartLines([]);
      }
    });

    return unsub;
  }, []);

  const cartLinesSafe = useMemo(() => {
    return Array.isArray(cartLines) ? cartLines : [];
  }, [cartLines]);

  const safeNumber = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v) ? v : 0;

  const formatCurrency = (v: unknown) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(safeNumber(v));

  const total = useMemo(() => {
    try {
      return getCartTotal(cartLinesSafe, customerType as CartCustomerType);
    } catch {
      return 0;
    }
  }, [cartLinesSafe, customerType]);

  // ✅ unit price vem do produto (l.product), não da linha inteira
  const getUnit = (l: CartLine) =>
    safeNumber(unitPriceFor(l.product, customerType as CartCustomerType));

  const pdfItems = useMemo(
    () =>
      cartLinesSafe.map((l) => {
        const unit = getUnit(l);
        return {
          slug: l.slug,
          qty: l.qty,
          name: l.product.name,
          model: l.product.model,
          price: unit,
        };
      }),
    // getUnit depende de customerType, então ele precisa estar no deps
    [cartLinesSafe, customerType]
  );

  const emailTo = "sales@starpro.com";
  const subject = encodeURIComponent("Order / Quote - StarPro");

  const body = useMemo(() => {
    const linesText = cartLinesSafe.map((l) => {
      const unit = getUnit(l);
      const subtotal = unit * l.qty;

      return `- ${l.product.name} (${l.product.model}) x${
        l.qty
      } | Unit: ${formatCurrency(unit)} | Subtotal: ${formatCurrency(
        subtotal
      )}`;
    });

    return encodeURIComponent(
      [
        "Hello, StarPro team!",
        "",
        "Here is my order/quote (PDF attached).",
        "",
        `Customer: ${customer.name || "-"}`,
        `Email: ${customer.email || "-"}`,
        `Phone: ${customer.phone || "-"}`,
        `Type: ${
          customerType === "regular" ? "regular (discount applied)" : "retail"
        }`,
        "",
        "Items:",
        ...linesText,
        "",
        `Total: ${formatCurrency(total)}`,
        "",
        "Thank you!",
      ].join("\n")
    );
  }, [cartLinesSafe, customer, customerType, total]);

  const mailto = useMemo(() => {
    return `mailto:${emailTo}?subject=${subject}&body=${body}`;
  }, [body, subject]);

  return (
    <main className={styles.page}>
      <div>
        <h1 className={styles.title}>Checkout</h1>
        <p className={styles.subtitle}>
          Review your order, download the PDF and send it by email.
        </p>
      </div>

      <div className={styles.grid}>
        {/* LEFT */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Customer details</h2>

          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            value={customer.name}
            onChange={(e) =>
              setCustomer((c) => ({ ...c, name: e.target.value }))
            }
            placeholder="Your name"
          />

          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            value={customer.email}
            onChange={(e) =>
              setCustomer((c) => ({ ...c, email: e.target.value }))
            }
            placeholder="you@example.com"
          />

          <label className={styles.label}>Phone</label>
          <input
            className={styles.input}
            value={customer.phone}
            onChange={(e) =>
              setCustomer((c) => ({ ...c, phone: e.target.value }))
            }
            placeholder="+1 (xxx) xxx-xxxx"
          />

          {customerType === "regular" && (
            <div className={styles.badge}>
              Regular customer — discount applied automatically
            </div>
          )}

          <div className={styles.steps}>
            <h3>1) Download PDF</h3>
            <p>
              Click <strong>Download PDF</strong>, save the file and attach it
              in the next step.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <GenerateQuotePdfButton
                items={pdfItems}
                customer={customer}
                customerType={customerType}
              />
            </div>

            <h3>2) Send by email</h3>
            <p>
              Click <strong>Open email</strong>, attach the PDF you downloaded
              and send it to StarPro.
            </p>

            {mounted ? (
              <a className={styles.secondaryCta} href={mailto}>
                Open email
              </a>
            ) : (
              <button className={styles.secondaryCta} type="button" disabled>
                Open email
              </button>
            )}
          </div>
        </section>

        {/* RIGHT */}
        <section className={styles.preview}>
          <div className={styles.previewHeader}>
            <div>
              <div className={styles.brand}>StarPro</div>
              <div className={styles.small}>Order / Quote</div>
            </div>
            <div className={styles.small}>{dateStr}</div>
          </div>

          <div className={styles.previewBody}>
            <div className={styles.previewInfo}>
              <div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Customer:</span>{" "}
                  {customer.name || "-"}
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Phone:</span>{" "}
                  {customer.phone || "-"}
                </div>
              </div>
              <div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email:</span>{" "}
                  {customer.email || "-"}
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Type:</span>{" "}
                  {customerType === "regular" ? "regular" : "retail"}
                </div>
              </div>
            </div>

            <div className={styles.previewTableHeader}>
              <div>PRODUCT</div>
              <div style={{ textAlign: "right" }}>QTY</div>
              <div style={{ textAlign: "right" }}>UNIT</div>
              <div style={{ textAlign: "right" }}>SUBTOTAL</div>
            </div>

            {!mounted ? (
              <div className={styles.previewEmpty}>Loading cart…</div>
            ) : cartLinesSafe.length === 0 ? (
              <div className={styles.previewEmpty}>Your cart is empty.</div>
            ) : (
              cartLinesSafe.map((l) => {
                const unit = getUnit(l);
                const subtotal = unit * l.qty;

                return (
                  <div key={l.slug} className={styles.previewRow}>
                    <div>
                      <div className={styles.prodName}>{l.product.name}</div>
                      <div className={styles.prodModel}>{l.product.model}</div>
                    </div>
                    <div className={styles.num}>{l.qty}</div>
                    <div className={styles.num}>{formatCurrency(unit)}</div>
                    <div className={styles.num}>{formatCurrency(subtotal)}</div>
                  </div>
                );
              })
            )}

            <div className={styles.previewTotal}>
              <div />
              <div />
              <div className={styles.totalLabel}>Total</div>
              <div className={styles.numStrong}>{formatCurrency(total)}</div>
            </div>

            <div className={styles.previewNote}>
              No payment on the site. The team confirms by email.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
