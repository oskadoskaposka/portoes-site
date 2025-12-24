export type Product = {
  slug: string;
  name: string;
  category: "Basculante" | "Deslizante" | "Pivotante";
  model: string;
  price: number;
  regularDiscount: number;
  description: string;
};

export const products: Product[] = [
  {
    slug: "deslizante-linea",
    name: "Portão Deslizante Linea",
    category: "Deslizante",
    model: "LINEA-01",
    price: 2890,
    regularDiscount: 0.12,
    description:
      "Estrutura reforçada com acabamento premium, ideal para residências e comércios.",
  },
  {
    slug: "basculante-urban",
    name: "Portão Basculante Urban",
    category: "Basculante",
    model: "URB-02",
    price: 3190,
    regularDiscount: 0.1,
    description:
      "Design moderno, leve e funcional, com excelente custo-benefício.",
  },
  {
    slug: "pivotante-prime",
    name: "Portão Pivotante Prime",
    category: "Pivotante",
    model: "PRM-03",
    price: 3990,
    regularDiscount: 0.15,
    description:
      "Duas folhas, presença marcante e personalização sob medida.",
  },
  {
    slug: "deslizante-industrial",
    name: "Portão Deslizante Industrial",
    category: "Deslizante",
    model: "IND-04",
    price: 4590,
    regularDiscount: 0.18,
    description:
      "Alta resistência para uso intenso e grandes vãos.",
  },
];
