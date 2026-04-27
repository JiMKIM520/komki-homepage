import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "콤키 소개 — komki",
  description: "창업자를 위한 비즈니스 레터, 콤키. KOMPA가 운영합니다.",
};

const SECTIONS = [
  {
    title: "복잡한 정보를 5분에",
    body:
      "마케팅·AI·트렌드. 매일 쏟아지는 정보 속에서 사장님이 꼭 알아야 할 것만 골라, 5일에 한 번 메일로 보내드립니다.",
  },
  {
    title: "현장에서 검증된 인사이트",
    body:
      "마케팅 에이전시 KOMPA의 현업 에디터들이 직접 발굴하고 큐레이션합니다. 이론이 아니라 매출·고객·실행에 바로 쓰는 정보를 다룹니다.",
  },
  {
    title: "사장님 시간을 아끼는 콘텐츠",
    body:
      "한 편을 읽는 데 5분, 그 안에 핵심·근거·실행 팁이 모두 담깁니다. 필요한 것만, 짧게.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#FBF8F1] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <span className="inline-flex items-center bg-black text-[#FBF8F1] text-sm md:text-base font-paperlogy font-semibold tracking-wide rounded-full px-5 py-2">
            콤키 소개
          </span>
          <h1 className="mt-6 md:mt-8 font-paperlogy font-semibold text-3xl md:text-5xl lg:text-6xl text-black leading-tight">
            창업자에게 필요한
            <br />
            인사이트만, 5일에 한 번.
          </h1>
          <p className="mt-6 md:mt-8 font-paperlogy text-base md:text-lg text-[#3F1C03] leading-relaxed max-w-2xl">
            콤키는 마케팅 에이전시 KOMPA가 만드는 창업자를 위한 비즈니스 레터입니다.
            매출·고객·실행에 바로 쓰는 인사이트를 큐레이션합니다.
          </p>
        </div>
      </section>

      {/* 3-section 본문 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {SECTIONS.map((s, i) => (
              <article key={s.title}>
                <p className="font-dm-serif text-3xl md:text-4xl text-black mb-3">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="font-paperlogy font-semibold text-xl md:text-2xl text-black leading-snug mb-3">
                  {s.title}
                </h2>
                <p className="font-paperlogy text-sm md:text-base text-[#3F1C03] leading-relaxed">
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About KOMPA */}
      <section className="py-16 md:py-24 bg-[#FBF8F1] text-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="font-dm-serif text-3xl md:text-5xl">About</h2>
              <span className="font-dm-serif text-3xl md:text-5xl">KOMPA</span>
            </div>
            <p className="font-paperlogy text-base md:text-lg leading-relaxed text-[#3F1C03]">
              KOMPA(콤파)는 브랜드 마케팅 에이전시입니다.
              퍼포먼스·콘텐츠·브랜딩을 넘나들며 작은 브랜드가 시장에서 살아남고
              성장하도록 돕습니다. 콤키는 그 현장에서 얻은 인사이트를
              사장님들과 나누기 위해 시작한 뉴스레터입니다.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Image
              src="/brand-logo.svg"
              alt="komki"
              width={180}
              height={192}
              className="brightness-0 opacity-90"
            />
          </div>
        </div>
      </section>

      {/* 연락처 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="font-paperlogy font-semibold text-2xl md:text-3xl text-black leading-tight">
            제휴·광고·문의
          </p>
          <a
            href="mailto:info@komki.co.kr"
            className="mt-4 inline-block font-dm-serif text-2xl md:text-4xl text-black underline-offset-4 hover:underline"
          >
            info@komki.co.kr
          </a>
          <p className="mt-3 font-paperlogy text-sm md:text-base text-[#3F1C03]">
            서울시 종로구 종로 325, 글라스타워 702호
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
