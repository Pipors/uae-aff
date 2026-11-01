import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";

const BASE_URL = "https://nexustech-store.com";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const description = `${product.shortDescription} Free express shipping and 2-year warranty included.`;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | NEXUS TECH`,
      description,
      url: `${BASE_URL}/product/${product.slug}`,
      type: "website",
      images: [
        {
          url: product.images[0],
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}

export default function ProductDetailPage({ params }: Props) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const jsonLdProduct = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images[0],
    description: product.shortDescription,
    sku: product.id,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/product/${product.slug}`,
      priceCurrency: "USD",
      price: product.price,
      availability:
        product.stockCount > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${BASE_URL}/shop` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category,
        item: `${BASE_URL}/shop?category=${encodeURIComponent(product.category)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${BASE_URL}/product/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
