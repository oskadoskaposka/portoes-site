import "./globals.css";
import styles from "../styles/layout.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "StarPro",
  description: "Portões e soluções sob medida",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={styles.body}>
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
