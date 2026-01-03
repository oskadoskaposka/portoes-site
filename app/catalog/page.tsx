"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { app } from "../../lib/firebaseClient"; // ajuste o caminho se necessário

type Product = {
  slug: string;
  name: string;
  series: string;
  model?: string;
  price: number;
  currency: string;
  active: boolean;
  sortOrder?: number;
  images: string[];
  features: string[];
};

export default function CatalogPage() {
  const [qText, setQText] = useState("");
  const [activeSeries, setActiveSeries] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Carrega 1x do Firestore (igual a Home)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const db = getFirestore(app);
        const col = collection(db, "products");

        // active == true + order by sortOrder
        const q = query(col, where("active", "==", true), orderBy("sortOrder", "asc"));
        const snap = await getDocs(q);

        const list: Product[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            slug: data.slug ?? d.id,
            name: data.name ?? d.id,
            series: data.series ?? "Other",
            model: data.model ?? "",
            price: Number(data.price ?? 0),
            currency: data.currency ?? "CAD",
            active: Boolean(data.active ?? true),
            sortOrder: Number(data.sortOrder ?? 9999),
            images: Array.isArray(data.images) ? data.images : [],
            features: Array.isArray(data.features) ? data.features : [],
          };
        });

        // garante ordem estável
        list.sort(
          (a, b) =>
            (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999) ||
            a.name.localeCompare(b.name)
        );

        setProducts(list);
      } catch (e: any) {
        setErrorMsg(e?.message ?? "Failed to load products.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const seriesStats = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      const s = (p.series || "Other").trim();
      map.set(s, (map.get(s) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([series, count]) => ({ series, count }))
      .sort((a, b) => a.series.localeCompare(b.series));
  }, [products]);

  const filtered = useMemo(() => {
    const q = qText.trim().toLowerCase();

    return products.filter((p) => {
      if (activeSeries !== "all" && p.series !== activeSeries) return false;
      if (!q) return true;

      const hay = `${p.name} ${p.model ?? ""} ${p.series} ${p.slug}`.toLowerCase();
      return hay.includes(q);
    });
  }, [products, qText, activeSeries]);

  return (
    <main className="page">
      <div className="wrap">
        <aside className="sidebar">
          <div className="card">
            <label className="label">Part # / Keyword</label>
            <input
              className="input"
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              placeholder="Search…"
            />

            <hr className="divider" />

            <div className="sectionTitle">CATEGORIES</div>

            <button
              className={`pill ${activeSeries === "all" ? "pillActive" : ""}`}
              onClick={() => setActiveSeries("all")}
              type="button"
            >
              <span>All products</span>
              <span className="count">{products.length}</span>
            </button>

            {seriesStats.map((it) => (
              <button
                key={it.series}
                className={`pill ${activeSeries === it.series ? "pillActive" : ""}`}
                onClick={() => setActiveSeries(it.series)}
                type="button"
              >
                <span>{it.series}</span>
                <span className="count">{it.count}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="content">
          <div className="contentHeader">
            <h1 className="title">Gate Catalog</h1>
            <div className="subtitle">
              {loading ? "Loading…" : `${filtered.length} product${filtered.length === 1 ? "" : "s"}`}
            </div>
          </div>

          {errorMsg ? (
            <div className="error">
              <strong>Firestore error:</strong> {errorMsg}
              <div className="errorHint">
                Confere se o `.env.local` tem `NEXT_PUBLIC_FIREBASE_PROJECT_ID` etc, e se a collection chama
                exatamente <code>products</code>.
              </div>
            </div>
          ) : loading ? (
            <div className="grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid">
              {filtered.map((p) => (
                <Link key={p.slug} href={`/product/${p.slug}`} className="productCard">
                  <div className="productTop">
                    <div className="productName">{p.name}</div>
                    <div className="productMeta">
                      <span className="badge">{p.series}</span>
                      {p.model ? <span className="muted">{p.model}</span> : null}
                    </div>
                  </div>

                  <div className="productBottom">
                    <div className="price">
                      {p.price > 0 ? (
                        <>
                          {p.currency} {p.price.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
                        </>
                      ) : (
                        <span className="muted">Price on request</span>
                      )}
                    </div>
                    <div className="cta">View</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .page {
          padding: 24px 0 60px;
          background: #f4f6f8;
          min-height: 70vh;
        }
        .wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 18px;
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 22px;
        }
        @media (max-width: 980px) {
          .wrap {
            grid-template-columns: 1fr;
          }
        }

        .card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 14px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
        }
        .label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
          margin-bottom: 6px;
          color: #111827;
        }
        .input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 14px;
          outline: none;
        }
        .input:focus {
          border-color: #b91c1c;
          box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.15);
        }
        .divider {
          border: none;
          border-top: 1px solid #eef0f3;
          margin: 14px 0;
        }
        .sectionTitle {
          font-size: 12px;
          font-weight: 900;
          color: #111827;
          margin-bottom: 10px;
          letter-spacing: 0.04em;
        }

        .pill {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          background: #fff;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 10px;
        }
        .pill:hover {
          border-color: #c7cbd1;
        }
        .pillActive {
          border-color: #b91c1c;
          box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.12);
        }
        .count {
          color: #6b7280;
          font-weight: 700;
        }

        .content {
          min-width: 0;
        }
        .contentHeader {
          margin: 4px 0 14px;
        }
        .title {
          margin: 0;
          font-size: 28px;
          font-weight: 900;
          color: #111827;
        }
        .subtitle {
          margin-top: 6px;
          color: #6b7280;
          font-size: 14px;
        }

        /* ✅ aqui é onde você pediu: mais espaçamento + cards separados */
        .grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }
        @media (max-width: 1100px) {
          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }

        .productCard {
          text-decoration: none;
          color: inherit;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .productCard:hover {
          border-color: #c7cbd1;
        }
        .productName {
          font-weight: 900;
          font-size: 16px;
          color: #111827;
        }
        .productMeta {
          margin-top: 6px;
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        .badge {
          background: rgba(185, 28, 28, 0.08);
          color: #b91c1c;
          border: 1px solid rgba(185, 28, 28, 0.25);
          padding: 3px 8px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }
        .muted {
          color: #6b7280;
          font-size: 13px;
          font-weight: 600;
        }
        .productBottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #eef0f3;
          padding-top: 10px;
        }
        .price {
          font-weight: 900;
          color: #111827;
        }
        .cta {
          font-weight: 900;
          color: #b91c1c;
        }

        .skeleton {
          height: 130px;
          border-radius: 12px;
          background: linear-gradient(90deg, #eef0f3 25%, #f7f7f7 37%, #eef0f3 63%);
          background-size: 400% 100%;
          animation: shimmer 1.2s ease-in-out infinite;
          border: 1px solid #e5e7eb;
        }
        @keyframes shimmer {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: 0 0;
          }
        }

        .error {
          background: #fff;
          border: 1px solid rgba(185, 28, 28, 0.25);
          border-left: 6px solid #b91c1c;
          border-radius: 12px;
          padding: 14px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
        }
        .errorHint {
          margin-top: 8px;
          color: #6b7280;
          font-size: 13px;
        }
      `}</style>
    </main>
  );
}
