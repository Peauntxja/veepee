import Link from "next/link";

export function VeepeeLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/gr/home" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="text-2xl font-bold tracking-tight text-black">Veepee</span>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
        className="text-veepee-pink"
      >
        <path
          d="M14 2C10 6 6 10 4 14c2 4 6 8 10 12 4-4 8-8 10-12-2-4-6-8-10-12z"
          fill="currentColor"
        />
        <path
          d="M14 8c-2 2-4 4-5 6 1 2 3 4 5 6 2-2 4-4 5-6-1-2-3-4-5-6z"
          fill="white"
          opacity="0.4"
        />
      </svg>
    </Link>
  );
}
