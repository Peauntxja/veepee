import { HeroHomeClient } from "@/components/home/HeroHomeClient";

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url(https://picsum.photos/seed/veepee-home/1600/900)",
      }}
    >
      <div className="min-h-screen bg-black/25 backdrop-blur-[1px]">
        <HeroHomeClient />
      </div>
    </div>
  );
}
