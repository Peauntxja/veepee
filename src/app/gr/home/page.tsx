import { HeroHomeClient } from "@/components/home/HeroHomeClient";

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url(/mock/image?variant=jungle&seed=home-hero&w=1600&h=900&text=" +
          encodeURIComponent("Veepee") +
          ")",
      }}
    >
      <div className="min-h-screen bg-black/25 backdrop-blur-[1px]">
        <HeroHomeClient />
      </div>
    </div>
  );
}
