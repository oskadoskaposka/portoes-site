"use client";

import jsPDF from "jspdf";

type QuoteItem = {
  slug: string;
  qty: number;
  name: string;
  model: string;
  price: number; // unit price já calculado (avulso ou regular)
};

type CustomerType = "avulso" | "regular";

export default function GenerateQuotePdfButton({
  items,
  customer,
  customerType,
}: {
  items: QuoteItem[];
  customer: { name: string; email: string; phone: string };
  customerType: CustomerType;
}) {
  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

  function generatePdf() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const marginX = 40;
    let y = 50;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("StarPro", marginX, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    y += 18;
    doc.text("Order / Quote", marginX, y);

    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US");
    doc.text(dateStr, 520, y, { align: "right" });

    y += 24;

    doc.setFont("helvetica", "bold");
    doc.text("Customer:", marginX, y);
    doc.setFont("helvetica", "normal");
    doc.text(customer.name || "-", marginX + 65, y);

    doc.setFont("helvetica", "bold");
    doc.text("Email:", 320, y);
    doc.setFont("helvetica", "normal");
    doc.text(customer.email || "-", 370, y);

    y += 16;

    doc.setFont("helvetica", "bold");
    doc.text("Phone:", marginX, y);
    doc.setFont("helvetica", "normal");
    doc.text(customer.phone || "-", marginX + 65, y);

    doc.setFont("helvetica", "bold");
    doc.text("Type:", 320, y);
    doc.setFont("helvetica", "normal");
    doc.text(customerType === "regular" ? "regular" : "retail", 370, y);

    y += 26;

    // header tabela
    doc.setDrawColor(220);
    doc.line(marginX, y, 555, y);
    y += 16;

    doc.setFont("helvetica", "bold");
    doc.text("PRODUCT", marginX, y);
    doc.text("QTY", 360, y);
    doc.text("UNIT", 430, y);
    doc.text("SUBTOTAL", 555, y, { align: "right" });

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.line(marginX, y, 555, y);
    y += 18;

    let total = 0;

    for (const it of items) {
      const subtotal = it.price * it.qty;
      total += subtotal;

      doc.setFont("helvetica", "bold");
      doc.text(it.name, marginX, y);

      doc.setFont("helvetica", "normal");
      y += 14;
      doc.text(it.model, marginX, y);

      doc.text(String(it.qty), 360, y - 14);
      doc.text(formatCurrency(it.price), 430, y - 14);
      doc.text(formatCurrency(subtotal), 555, y - 14, { align: "right" });

      y += 14;

      doc.setDrawColor(235);
      doc.line(marginX, y, 555, y);
      y += 18;

      // quebra de página simples
      if (y > 740) {
        doc.addPage();
        y = 60;
      }
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Total", 430, y);
    doc.text(formatCurrency(total), 555, y, { align: "right" });

    y += 30;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      "No payment on the site. The team confirms by email.",
      marginX,
      y
    );

    doc.save("starpro-quote.pdf");
  }

  return (
    <button type="button" onClick={generatePdf}>
      Download PDF
    </button>
  );
}
