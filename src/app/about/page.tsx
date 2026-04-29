import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "콤키 소개 — komki",
  description:
    "콤키(KOMKI)는 창업자와 소상공인을 위한 비즈니스 레터입니다. 5일에 한 번, AI·마케팅·트렌드 인사이트를 가볍게 전합니다.",
};

const EDITORS = [
  {
    name: "AI 콤키",
    image: "/editors/editor-ai.png",
    slogan: "관심사도 취미도 취향도 다 많은 잡식 인간",
    description:
      "영화관에선 엔딩크레딧 끝까지 보고, 신상 AI는 출시 당일에 써봐야 하는 에디터예요. 관심사가 너무 넓어서 가끔 본인도 피곤한 편입니다.",
  },
  {
    name: "마케팅 콤키",
    image: "/editors/editor-marketing.png",
    slogan: "맛있는 거 앞에선 일단 사진부터, 그리고 마케팅 분석까지",
    description:
      "새로 뜬 카페는 오픈런하고, 핫플 팝업은 줄 서서라도 가봐야 직성이 풀리는 에디터예요. F&B와 브랜드 사이를 오가며, 잘 팔리는 가게엔 어떤 마케팅 한 끗이 숨어 있는지 뜯어보는 게 취미. '취향 있는 사람'이 되고 싶어 오늘도 부지런히 발품을 팝니다.",
  },
  {
    name: "트렌드 콤키",
    image: "/editors/editor-trend.png",
    slogan: "뒤쳐지는 건 절대 못 참아요!",
    description:
      '하루에 8시간 웹서핑은 기본, 세상의 모든 \'힙\'한 것들을 수집하는 막내 에디터! "요즘 그게 왜 난리야?" 싶을 땐 고민 말고 저에게 물어보세요.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── 네비바와 크림박스 사이 흰 spacer ── */}
      <div className="bg-white h-8 md:h-16" />

      {/* ── 헤드라인 (#FBF8F1 박스 + 큰 따옴표 4개, 박스 경계에 걸침) ── */}
      <section className="relative bg-[#FBF8F1] py-12 md:py-20">
        {/* 좌상단 큰 따옴표 두 개 (열기, stroke) — 위 경계에 절반 걸침 */}
        <div className="absolute top-0 left-[20%] md:left-[22%] -translate-y-[30%] flex gap-0.5 md:gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about/quote-open-stroke.svg"
            alt=""
            aria-hidden
            className="w-3.5 md:w-6 h-auto select-none pointer-events-none"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about/quote-open-stroke.svg"
            alt=""
            aria-hidden
            className="w-3.5 md:w-6 h-auto select-none pointer-events-none"
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-12">
          {/* 헤드라인 한 줄 */}
          <h1 className="font-paperlogy font-semibold text-2xl md:text-5xl lg:text-6xl text-black leading-tight text-center break-keep px-12 md:px-20">
            사장님의 하루에, 작은 쉼표 하나
          </h1>
        </div>

        {/* 우하단 큰 따옴표 두 개 (닫기, fill) — 아래 경계에 절반 걸침 */}
        <div className="absolute bottom-0 right-[20%] md:right-[22%] translate-y-[30%] flex gap-0.5 md:gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about/quote-close-fill.svg"
            alt=""
            aria-hidden
            className="w-3.5 md:w-6 h-auto select-none pointer-events-none"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about/quote-close-fill.svg"
            alt=""
            aria-hidden
            className="w-3.5 md:w-6 h-auto select-none pointer-events-none"
          />
        </div>
      </section>

      {/* ── 본문 카피 (중앙 정렬) ── */}
      <section className="bg-white py-14 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="space-y-6 md:space-y-7 font-paperlogy text-black leading-loose break-keep text-base md:text-lg text-center">
            <p className="font-semibold text-lg md:text-xl">
              콤키(KOMKI)는 창업자와 소상공인을 위한 비즈니스 레터예요!
            </p>

            <p>
              5일에 한 번, 사장님의 메일함으로 가볍게 읽을 트렌드 한 입을
              배달해 드립니다.
            </p>

            <div>
              <p>AI, 마케팅, 트렌드까지!</p>
              <p>
                매장에 앉아서도, 출근길 지하철에서도 5분이면 술술 읽히는
                분량으로 에디터가 골라낸 인사이트를 사장님과 가장 가까운
                언어로 옮겨 전해 드려요.
              </p>
            </div>

            <div>
              <p>어려운 용어나 먼 나라 이야기는 잠시 접어두고,</p>
              <p>오늘 바로 가게에 써볼 수 있는 이야기.</p>
              <p>옆 가게 사장님이 슬쩍 건네주는 팁 같은 이야기로요!</p>
            </div>

            <div>
              <p>
                메일을 한 줄씩 따라가다 보면, 어제보다 조금 더 단단해진
                사장님이 되어 있을지도 몰라요.
              </p>
              <p>콤키가 그 길에 작은 동행이 되어드릴게요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── KOMKI's 에디터 소개 ── */}
      <section className="bg-white py-14 md:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          {/* 타이틀 + 양옆 구분선 */}
          <div className="flex items-center gap-4 md:gap-6 mb-10 md:mb-14">
            <div className="flex-1 h-[3px] md:h-[5px] bg-black" />
            <h2 className="font-paperlogy font-semibold text-xl md:text-3xl text-black whitespace-nowrap">
              KOMKI&apos;s 에디터 소개
            </h2>
            <div className="flex-1 h-[3px] md:h-[5px] bg-black" />
          </div>

          {/* 에디터 카드 3개 */}
          <div className="space-y-8 md:space-y-12">
            {EDITORS.map((editor) => (
              <article
                key={editor.name}
                className="flex flex-col md:flex-row items-center md:items-stretch gap-5 md:gap-8"
              >
                {/* 프로필 사진 */}
                <div className="shrink-0 relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-[3px] border-black bg-white">
                  <Image
                    src={editor.image}
                    alt={editor.name}
                    fill
                    sizes="(max-width: 768px) 128px, 192px"
                    className="object-cover"
                  />
                </div>

                {/* 카드 */}
                <div className="flex-1 w-full bg-white rounded-xl border border-black shadow-[6px_6px_0_rgba(0,0,0,0.15)] overflow-hidden">
                  {/* 검정 슬로건 바 */}
                  <div className="bg-black px-5 md:px-8 py-3 md:py-4">
                    <p className="font-paperlogy font-semibold text-sm md:text-lg text-[#FBF8F1] break-keep">
                      &ldquo;{editor.slogan}&rdquo;
                    </p>
                  </div>
                  {/* 이름 + 설명 */}
                  <div className="px-5 md:px-8 py-4 md:py-5">
                    <p className="font-paperlogy font-semibold text-base md:text-lg text-black mb-1.5 md:mb-2">
                      {editor.name}
                    </p>
                    <p className="font-paperlogy text-sm md:text-base text-[#3F1C03] leading-relaxed break-keep">
                      {editor.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
