import Link from "next/link";
import { getHomePageMeta } from "@/lib/api/loadSnapshot";

const homeMeta = getHomePageMeta();

export function HomeValueSections() {
  return (
    <section className="relative bg-white px-6 py-14">
      <div className="mx-auto grid max-w-[1120px] gap-10 md:grid-cols-3">
        {homeMeta.valuePropositions.map((item) => (
          <div key={item.title}>
            <h3 className="text-lg font-bold leading-snug text-black">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-veepee-muted">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-10 flex max-w-[1120px] justify-center">
        <Link
          href="/gr/authentication"
          className="border border-black px-10 py-3 text-sm font-semibold text-black hover:bg-gray-50"
        >
          S&apos;identifier
        </Link>
      </div>
    </section>
  );
}
