import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "static.vente-privee.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/gr/home/default", destination: "/gr/home", permanent: false },
      { source: "/gr/voyage/default", destination: "/gr/h/voyage", permanent: false },
      { source: "/gr/h/mode-enfant", destination: "/gr/h/enfant", permanent: false },
      { source: "/gr/h/mode-chaussures", destination: "/gr/h/chaussures", permanent: false },
      { source: "/gr/h/beaute-et-bien-etre", destination: "/gr/h/beaute", permanent: false },
      { source: "/gr/h/mode-sportswear", destination: "/gr/h/sport", permanent: false },
      { source: "/gr/h/vin-et-epicerie", destination: "/gr/h/vin", permanent: false },
      { source: "/gr/h/loisirs", destination: "/gr/h/loisir", permanent: false },
      { source: "/gr/h/rosedeals-coupons", destination: "/gr/h/rosedeals", permanent: false },
      { source: "/gr/home/brandsplace", destination: "/gr/h/the-place", permanent: false },
      { source: "/gr/find", destination: "/gr/search", permanent: false },
    ];
  },
};

export default nextConfig;
