"use client";

import Image from "next/image";
import Link from "next/link";
import { GhostPost } from "@/lib/ghost-types";

export default function LatestArticles({ posts }: { posts: GhostPost[] }) {
  const grid = posts.slice(0, 6);
  if (grid.length === 0) return null;

  const viewAllHref = "/articles";

  return (
    <section id="articles" className="pt-10 pb-14 md:pt-14 md:pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* 섹션 헤더 — 모든 콘텐츠 알약 */}
        <div className="mb-8 md:mb-10">
          <span className="inline-flex items-center bg-black text-[#FBF8F1] text-sm md:text-base font-paperlogy font-semibold tracking-wide rounded-full px-5 py-2">
            모든 콘텐츠
          </span>
        </div>

        {/* 데스크톱: 3×2 그리드 */}
        <div className="hidden md:grid md:grid-cols-3 gap-x-8 gap-y-14">
          {grid.map((post) => (
            <Link
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {post.feature_image ? (
                  <Image
                    src={post.feature_image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-black/30 text-5xl font-black">
                    komki
                  </div>
                )}
              </div>
              <h3 className="mt-4 font-paperlogy font-medium text-base md:text-lg leading-snug text-black line-clamp-2 text-left max-w-[70%] transition-colors group-hover:text-[#3F1C03]">
                {post.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* 모바일: 2행 가로 스크롤 + 검정 제목박스 카드 (고정 높이) */}
        <div className="md:hidden -mx-4 px-4 grid grid-rows-2 grid-flow-col auto-cols-[45%] gap-x-3 gap-y-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
          {grid.map((post) => (
            <Link
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="snap-start block"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {post.feature_image ? (
                  <Image
                    src={post.feature_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="45vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-black/30 text-5xl font-black">
                    komki
                  </div>
                )}
              </div>
              <div className="bg-black px-3 py-3 h-[72px] flex items-start">
                <h3 className="font-paperlogy font-medium text-xs text-[#FBF8F1] leading-snug line-clamp-3">
                  {post.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* 더보기 버튼 — 외곽 stroke 박스 + 내부 알약 */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <div className="border-[3px] border-black rounded-full p-1.5">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-2 border-2 border-black rounded-full px-7 py-3 font-paperlogy text-sm md:text-base font-semibold tracking-wide text-black hover:bg-black hover:text-[#FBF8F1] transition-colors"
            >
              더보기 <span className="text-base leading-none">+</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
