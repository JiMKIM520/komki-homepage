import Image from "next/image";
import Link from "next/link";

export default function AdSection() {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* "콤키 스페셜" 알약 라벨 */}
        <div className="mb-6 md:mb-8">
          <span className="inline-flex items-center bg-black text-[#FBF8F1] text-sm md:text-base font-paperlogy font-semibold tracking-wider rounded-full px-5 py-2">
            콤키 스페셜
          </span>
        </div>

        {/* 시안 가로형 배너 1장 (1364×308 ≈ 4.43:1) */}
        <Link
          href="#"
          aria-label="콤키 스페셜"
          className="block relative w-full aspect-[1364/308] overflow-hidden rounded-2xl transition-transform hover:scale-[1.01] duration-300"
        >
          <Image
            src="/special-banner.png"
            alt="콤키 스페셜 배너"
            fill
            sizes="(max-width: 768px) 100vw, 1280px"
            className="object-cover"
          />
        </Link>
      </div>
    </section>
  );
}
