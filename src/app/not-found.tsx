import Link from "next/link";
import { getLocalImage } from "@/lib/assets/localImages";

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${getLocalImage("not-found")})`,
      }}
    >
      <div className="min-h-screen bg-white/60">
        <div className="mx-auto flex max-w-6xl items-center justify-start px-6 pt-28">
          <div className="w-[360px] bg-white px-10 py-8 shadow-xl">
            <h1 className="text-center text-xs font-bold uppercase tracking-widest">
              On était pourtant sûr
              <br />
              de l&apos;avoir mise ici !
            </h1>
            <p className="mt-8 text-center text-xs text-veepee-muted">
              Désolé, la page demandée est introuvable.
            </p>
            <Link
              href="/gr/home"
              className="mt-6 block bg-veepee-pink py-3 text-center text-sm font-semibold text-white"
            >
              Retourner à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
