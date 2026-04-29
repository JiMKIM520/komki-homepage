import Image from "next/image";
import Link from "next/link";
import { getPostsByTag } from "@/lib/ghost";

const PLACEHOLDERS: ReadonlyArray<{
  key: string;
  bg: string;
  label: string;
  title: string;
}> = [
  { key: "info-ph-1", bg: "#3F1C03", label: "Today's Bite", title: "오늘의 한 입,\n사장님 가게에 바로" },
  { key: "info-ph-2", bg: "#0F4C3A", label: "Quick Read", title: "5분이면 충분한\n인사이트 한 입" },
  { key: "info-ph-3", bg: "#7A2E1F", label: "Daily Digest", title: "매일 한 입씩\n쌓이는 트렌드" },
];

type CardData = {
  key: string;
  href: string;
  external: boolean;
  image: string | null;
  title: string;
  label?: string;
  bg?: string;
};

export default async function InfoSection() {
  const infos = await getPostsByTag("info", 3);
  const items: CardData[] =
    infos.length === 0
      ? PLACEHOLDERS.map((ph) => ({
          key: ph.key,
          href: "#",
          external: false,
          image: null,
          title: ph.title,
          label: ph.label,
          bg: ph.bg,
        }))
      : infos.map((post) => ({
          key: post.id,
          href: `/${post.slug}/`,
          external: false,
          image: post.feature_image,
          title: post.title,
        }));

  return (
    <section className="py-14 md:py-20 bg-[#FBF8F1]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* "한입 정보" 알약 라벨 */}
        <div className="mb-6 md:mb-8">
          <span className="inline-flex items-center bg-black text-[#FBF8F1] text-sm md:text-base font-paperlogy font-semibold tracking-wide rounded-full px-5 py-2">
            한입 정보
          </span>
        </div>

        {/* 데스크톱: 3컬럼 그리드 */}
        <div className="hidden md:grid md:grid-cols-3 gap-5">
          {items.map((item) => (
            <Card key={item.key} item={item} />
          ))}
        </div>

        {/* 모바일: 가로 스크롤, 한 카드씩 (옆 카드 살짝 보임) */}
        <div className="md:hidden -mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
          {items.map((item) => (
            <Card key={item.key} item={item} mobile />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ item, mobile = false }: { item: CardData; mobile?: boolean }) {
  const widthClass = mobile ? "snap-start shrink-0 w-[85%]" : "w-full";

  return (
    <Link
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      aria-label={item.title}
      className={`group block ${widthClass}`}
    >
      {/* 썸네일 박스 — 4:5 세로 (콤키 스페셜과 동일 비율) */}
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#FBF8F1] transition-transform group-hover:scale-[1.01] duration-300"
        style={item.bg ? { backgroundColor: item.bg } : undefined}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 85vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          item.label && (
            <div className="absolute top-4 left-4 font-bungee text-[10px] md:text-xs uppercase tracking-widest text-white opacity-90">
              {item.label}
            </div>
          )
        )}
      </div>

      {/* 제목 */}
      <h3 className="mt-3 md:mt-4 font-paperlogy font-medium text-base md:text-lg leading-snug text-black line-clamp-2 break-keep transition-colors group-hover:text-[#3F1C03]">
        {item.title}
      </h3>
    </Link>
  );
}
