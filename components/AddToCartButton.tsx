"use client";

import { useState } from "react";
import type { Product } from "../data/products";
import { addToCart } from "../lib/cart";

export default function AddToCartButton({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const [added, setAdded] = useState(false);

  return (
    <button
      className={className}
      onClick={() => {
        addToCart(product, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
    >
      {added ? "Adicionado ✅" : "Adicionar ao carrinho"}
    </button>
  );
}
