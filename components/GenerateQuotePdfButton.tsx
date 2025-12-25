"use client";

import jsPDF from "jspdf";
import type { CartItem } from "../lib/cart";
import { priceFor } from "../lib/cart";

export default function GenerateQuotePdfButton({
  items,
  customerType,
  customer,
  className,
}: {
  items: CartItem[];
  customerType: "avulso" | "regular";
  customer: { name: string; email: string; phone: string };
  className?: string;
}) {
  return (
    <button
      className={className}
      onClick={() => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("StarPro - Pedido / Orçamento", 14, 18);

        doc.setFontSize(11);
        doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 14, 28);
        doc.text(`Tipo de cliente: ${customerType}`, 14, 34);

        doc.setFontSize(11);
        doc.text(`Cliente: ${customer.name || "-"}`, 14, 44);
        doc.text(`Email: ${customer.email || "-"}`, 14, 50);
        doc.text(`Telefone: ${customer.phone || "-"}`, 14, 56);

        let y = 68;
        doc.setFontSize(12);
        doc.text("Itens:", 14, y);
        y += 8;

        doc.setFontSize(10);
        let total = 0;

        items.forEach((it, idx) => {
          const unit = priceFor(it, customerType);
          const sub = unit * it.qty;
          total += sub;

          doc.text(`${idx + 1}. ${it.name} (${it.model})`, 14, y);
          y += 6;
          doc.text(
            `Qtd: ${it.qty} | Unit: R$ ${unit.toLocaleString("pt-BR")} | Sub: R$ ${sub.toLocaleString("pt-BR")}`,
            18,
            y
          );
          y += 8;

          if (y > 270) {
            doc.addPage();
            y = 18;
          }
        });

        doc.setFontSize(12);
        doc.text(`Total: R$ ${total.toLocaleString("pt-BR")}`, 14, y + 8);

        doc.save(`starpro-orcamento-${Date.now()}.pdf`);
      }}
    >
      Baixar PDF
    </button>
  );
}
