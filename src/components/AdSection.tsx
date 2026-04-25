import Image from "next/image";
import Link from "next/link";
import { getPostsByTag } from "@/lib/ghost";

// Ghost에 special 태그 콘텐츠가 없을 때 사용할 fallback placeholder.
const PLACEHOLDERS: ReadonlyArray<{
  id: string;
  bg: string;
  label: string;
  title: string;
}> = [
  {
    id: "ph-1",
    bg: "#FFAC2F",
    label: "Editor's Pick",
    title: "에디터가 직접 고른\n이달의 인사이트",
  },
  {
    id: "ph-2",
    bg: "#5ABAC5",
    label: "Special Series",
    title: "사장님이 꼭 챙겨야 할\n시리즈 콘텐츠",
  },
  {
    id: "ph-3",
    bg: "#FFC4C4",
    label: "Editor Interview",
    title: "이달의 브랜드,\n에디터 인터뷰",
  },
];

export default async function AdSection() {
  const specials = await getPostsByTag("seupesyeol", 3);
  const useFallback = specials.length === 0;

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* "콤키 스페셜" 알약 라벨 */}
        <div className="mb-6 md:mb-8">
          <span className="inline-flex items-center bg-black text-[#FBF8F1] text-sm md:text-base font-paperlogy font-semibold tracking-wide rounded-full px-5 py-2">
            콤키 스페셜
          </span>
        </div>

        {/* 3개 썸네일 그리드 (4:3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {useFallback
            ? PLACEHOLDERS.map((ph) => (
                <Link
                  key={ph.id}
                  href="#"
                  aria-label={ph.label}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl transition-transform hover:scale-[1.01] duration-300"
                  style={{ backgroundColor: ph.bg }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  <div className="relative h-full flex flex-col justify-between p-5 md:p-6 text-white">
                    <span className="font-bungee text-[10px] md:text-xs uppercase tracking-widest opacity-90">
                      {ph.label}
                    </span>
                    <h3 className="font-paperlogy font-semibold text-lg md:text-xl leading-snug whitespace-pre-line">
                      {ph.title}
                    </h3>
                  </div>
                </Link>
              ))
            : specials.map((post) => (
                <Link
                  key={post.id}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={post.title}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-[#FBF8F1] transition-transform hover:scale-[1.01] duration-300"
                >
                  {post.feature_image ? (
                    <Image
                      src={post.feature_image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-black/30 text-5xl font-black">
                      komki
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />
                  <div className="relative h-full flex flex-col justify-end p-5 md:p-6 text-white">
                    <h3 className="font-paperlogy font-semibold text-lg md:text-xl leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
