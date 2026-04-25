import Link from "next/link";

// Ad 슬롯 placeholder.
// TODO: Ghost의 #ad / #sponsor 태그 기반 동적 로딩으로 전환 (옵션 B).
const PLACEHOLDERS: ReadonlyArray<{
  id: string;
  bg: string;
  title: string;
  description: string;
}> = [
  {
    id: "slot-1",
    bg: "bg-[#2E9D5F]",
    title: "정부지원사업 안내",
    description: "사장님이 꼭 챙겨야 할 지원사업 공고, 한눈에 보기",
  },
  {
    id: "slot-2",
    bg: "bg-[#3B6FDB]",
    title: "서포터즈 모집 안내",
    description: "우리 브랜드와 함께할 크리에이터/리뷰어 모집",
  },
  {
    id: "slot-3",
    bg: "bg-[#F08541]",
    title: "에디터 인터뷰",
    description: "콤키 에디터가 직접 소개하는 이달의 브랜드",
  },
  {
    id: "slot-4",
    bg: "bg-[#2E9D5F]",
    title: "정부지원사업 안내",
    description: "사장님이 꼭 챙겨야 할 지원사업 공고, 한눈에 보기",
  },
  {
    id: "slot-5",
    bg: "bg-[#3B6FDB]",
    title: "서포터즈 모집 안내",
    description: "우리 브랜드와 함께할 크리에이터/리뷰어 모집",
  },
  {
    id: "slot-6",
    bg: "bg-[#F08541]",
    title: "에디터 인터뷰",
    description: "콤키 에디터가 직접 소개하는 이달의 브랜드",
  },
] as const;

export default function AdSection() {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* 섹션 라벨 */}
        <div className="mb-6 md:mb-8">
          <span className="inline-flex items-center bg-black text-[#FBF8F1] text-sm md:text-base font-bold tracking-wider rounded-full px-5 py-2">
            Ad
          </span>
        </div>

        {/* 2×3 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {PLACEHOLDERS.map((slot) => (
            <Link
              key={slot.id}
              href="#"
              className={`relative block rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[4/3] ${slot.bg} p-6 transition-transform hover:scale-[1.01] duration-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              <div className="relative h-full flex flex-col justify-between text-white">
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-70">
                  Sponsored
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg leading-tight mb-1.5">
                    {slot.title}
                  </h3>
                  <p className="text-xs md:text-sm leading-snug opacity-90 line-clamp-2">
                    {slot.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
