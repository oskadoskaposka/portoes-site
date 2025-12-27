import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import catalogStyles from "../styles/catalog.module.css";

type PageProps = {
  searchParams?: {
    q?: string;
    cat?: string;
  };
};

export default function HomePage({ searchParams }: PageProps) {
  const q = (searchParams?.q || "").trim().toLowerCase();
  const cat = (searchParams?.cat || "").trim();

  const categories = Array.from(
    products.reduce((acc, p) => {
      acc.set(p.category, (acc.get(p.category) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).sort((a, b) => a[0].localeCompare(b[0]));

  const filtered = products.filter((p) => {
    const matchesCat = !cat || p.category === cat;
    const matchesQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q);

    return matchesCat && matchesQ;
  });

  return (
    <div className="container">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 20,
          alignItems: "start",
          paddingTop: 18,
          paddingBottom: 30,
        }}
      >
        {/* LEFT SIDEBAR */}
        <aside
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            overflow: "hidden",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {/* Search */}
          <div style={{ padding: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <form method="get" action="/" style={{ display: "flex", gap: 8 }}>
              <input
                name="q"
                defaultValue={searchParams?.q || ""}
                placeholder="Part # / Keyword"
                style={{
                  flex: 1,
                  height: 36,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(0,0,0,0.25)",
                  color: "inherit",
                  padding: "0 10px",
                  outline: "none",
                }}
              />
              {cat ? <input type="hidden" name="cat" value={cat} /> : null}
              <button
                type="submit"
                style={{
                  height: 36,
                  padding: "0 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                Search
              </button>
            </form>
          </div>

          {/* Categories */}
          <div style={{ padding: 12 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: 0.6,
                opacity: 0.9,
                marginBottom: 10,
              }}
            >
              CATEGORIES
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <a
                href={q ? `/?q=${encodeURIComponent(q)}` : "/"}
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  textDecoration: "none",
                  color: "inherit",
                  background: !cat ? "rgba(255,255,255,0.06)" : "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                All products <span style={{ opacity: 0.7 }}>({products.length})</span>
              </a>

              {categories.map(([name, count]) => {
                const href = `/?cat=${encodeURIComponent(name)}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
                const active = cat === name;

                return (
                  <a
                    key={name}
                    href={href}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 10,
                      textDecoration: "none",
                      color: "inherit",
                      background: active ? "rgba(255,255,255,0.06)" : "transparent",
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <span>{name}</span>
                    <span style={{ opacity: 0.7 }}>({count})</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Catalog</h1>
              <p style={{ margin: "6px 0 0", opacity: 0.75 }}>
                {cat ? (
                  <>
                    Showing <strong>{cat}</strong>
                  </>
                ) : (
                  "Browse products by category"
                )}
                {q ? (
                  <>
                    {" "}
                    — search: <strong>{searchParams?.q}</strong>
                  </>
                ) : null}
              </p>
            </div>

            <div style={{ opacity: 0.75, fontSize: 14 }}>
              {filtered.length} item{filtered.length === 1 ? "" : "s"}
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            {filtered.length === 0 ? (
              <div
                style={{
                  marginTop: 14,
                  padding: 16,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                No products found. Try another category or search.
              </div>
            ) : (
              <div className={catalogStyles.grid}>
                {filtered.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
