import { SafeImg } from "@/components/common/SafeImg";
import { getLocalImage } from "@/lib/assets/localImages";

type AccountEmptyCardProps = {
  seed: string;
  title: string;
  description: string;
  ctaLabel: string;
};

export function AccountEmptyCard({
  seed,
  title,
  description,
  ctaLabel,
}: AccountEmptyCardProps) {
  return (
    <div className="rounded border border-veepee-border bg-white p-8 shadow-sm">
      <div className="mx-auto max-w-lg text-center">
        <div className="relative mx-auto aspect-[16/10] w-full overflow-hidden rounded bg-gray-100">
          <SafeImg
            src={getLocalImage("account-empty")}
            fallbackSrc={`/mock/image?seed=${seed}&w=900&h=560&text=Veepee`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <h2 className="mt-6 text-lg font-bold">{title}</h2>
        <p className="mt-2 text-sm text-veepee-muted">{description}</p>
        <button
          type="button"
          className="mt-6 bg-veepee-pink px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
