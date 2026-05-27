import Image from "next/image";
import Link from "next/link";
import { getLocalImage } from "@/lib/assets/localImages";

type VeepeeLogoProps = {
  className?: string;
  variant?: "black" | "white";
};

export function VeepeeLogo({ className = "", variant = "black" }: VeepeeLogoProps) {
  const src =
    variant === "white"
      ? getLocalImage("veepee-white")
      : getLocalImage("veepee-black");

  return (
    <Link href="/gr/home" className={`inline-flex items-center ${className}`}>
      <Image
        src={src}
        alt="Veepee"
        width={120}
        height={32}
        priority
        className="h-8 w-auto"
      />
    </Link>
  );
}
