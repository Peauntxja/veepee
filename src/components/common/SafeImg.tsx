"use client";

import { useState } from "react";

type SafeImgProps = {
  src: string;
  alt: string;
  className?: string;
  draggable?: boolean;
  fallbackSrc?: string;
};

export function SafeImg({
  src,
  alt,
  className = "",
  draggable = false,
  fallbackSrc,
}: SafeImgProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  if (failed || !currentSrc) {
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
      src={currentSrc}
      alt={alt}
      draggable={draggable}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
          return;
        }
        setFailed(true);
      }}
      className={className}
      loading="lazy"
    />
  );
}
