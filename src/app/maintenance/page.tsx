import Image from "next/image";

export const metadata = {
  title: "콤키는 업그레이드 중입니다 — komki",
  description: "콤키는 업그레이드 중입니다. 곧 만나요.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#FBF8F1] text-black px-6 py-16">
      <Image
        src="/brand-logo.svg"
        alt="komki"
        width={140}
        height={150}
        priority
        className="brightness-0 opacity-90 mb-10"
      />
      <p
        className="text-5xl md:text-7xl text-black mb-6"
        style={{ fontFamily: "var(--font-brand)" }}
      >
        KOMKI
      </p>
      <h1 className="font-paperlogy font-semibold text-2xl md:text-4xl text-center text-black leading-snug">
        콤키는 업그레이드 중입니다.
      </h1>
      <p className="mt-3 md:mt-4 font-paperlogy text-base md:text-xl text-[#3F1C03]">
        곧 만나요.
      </p>
    </main>
  );
}
