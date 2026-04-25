import Image from "next/image";
import SubscribeForm from "./SubscribeForm";

export default function Footer() {
  return (
    <footer>
      {/* ── 구독 섹션 ── */}
      <section id="subscribe" className="bg-[#FBF8F1] py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-10 md:gap-16 md:items-center">
          <div className="flex-1">
            <p className="font-serif font-black text-2xl md:text-3xl lg:text-4xl leading-snug text-black">
              사장님이라면
              <br />
              꼭 챙겨야할 인사이트 !
            </p>
            <p className="mt-4 text-base md:text-lg text-[#3F1C03] leading-relaxed">
              5일에 한 번 메일로 트렌드 한 입 !
            </p>
          </div>
          <div className="flex-1 md:max-w-md w-full">
            <SubscribeForm source="footer" variant="default" />
          </div>
        </div>
      </section>

      {/* ── 하단 Footer (검정) ── */}
      <div className="bg-black text-[#FBF8F1]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
          {/* 좌: 브랜드 로고 + About KOMPA */}
          <div className="flex items-start gap-6 md:gap-8">
            <Image
              src="/brand-logo.svg"
              alt="komki"
              width={110}
              height={118}
              className="brightness-0 invert shrink-0"
            />
            <div>
              <p
                className="text-4xl md:text-5xl leading-none text-[#FBF8F1]"
                style={{ fontFamily: "var(--font-brand)" }}
              >
                KOMKI
              </p>
              <div className="mt-7 md:mt-9 flex items-baseline gap-3">
                <h3 className="font-serif font-bold text-xl md:text-2xl">About</h3>
                <span
                  className="text-xl md:text-2xl"
                  style={{ fontFamily: "var(--font-brand)" }}
                >
                  KOMPA
                </span>
              </div>
              <div className="mt-3 space-y-1 text-xs md:text-sm text-[#FBF8F1]/70 leading-relaxed">
                <p>
                  광고 제휴 문의{" "}
                  <a
                    href="mailto:kompa@marketing.or.kr"
                    className="hover:text-[#FBF8F1] transition-colors"
                  >
                    kompa@marketing.or.kr
                  </a>
                </p>
                <p>서울시 종로구 종로 325, 글라스타워 702호</p>
              </div>
            </div>
          </div>

          {/* 우: 카피라이트 */}
          <p className="text-xs md:text-sm text-[#FBF8F1]/50 shrink-0">
            KOMKI © {new Date().getFullYear()} KOMPA. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
