"use client";

import { useState } from "react";

type SafeImgProps = {
  src: string;
  alt: string;
  className?: string;
  draggable?: boolean;
};

export function SafeImg({
  src,
  alt,
  className = "",
  draggable = false,
}: SafeImgProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        aria-label={alt}
        role="img"
        className={`h-full w-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 ${className}`}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      draggable={draggable}
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}

