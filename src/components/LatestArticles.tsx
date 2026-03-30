"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GhostPost } from "@/lib/ghost";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function LatestArticles({ posts }: { posts: GhostPost[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (posts.length === 0) return null;

  return (
    <section
      id="articles"
      className="pt-4 pb-6"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between py-3 border-b border-[#e8d9c0] mb-px">
          <span className="text-[10px] font-extrabold text-[#2d2416] tracking-[0.2em] uppercase">
            New Topics
          </span>
          <a
            href={process.env.NEXT_PUBLIC_GHOST_URL || "https://www.komki.co.kr"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[8px] text-[#b8a898] hover:text-[#d97706] transition-colors"
          >
            view all →
          </a>
        </div>

        {/* 1px 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[2px] bg-[#2d2416]">
          {posts.map((post, i) => {
            const tag = post.tags?.[0];
            const isHovered = hoveredIndex === i;

            return (
              <Link
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredIndex(i)}
                className="group bg-[#fdf6ec] flex flex-col overflow-hidden"
              >
                {/* ── 이미지 + 메타 컬럼 ── */}
                <div className="flex">
                  {/* 썸네일 */}
                  <div
                    className="relative overflow-hidden bg-[#e8d9c0]"
                    style={{ flex: "1 1 0", aspectRatio: "16/10", minHeight: 0 }}
                  >
                    {post.feature_image ? (
                      <Image
                        src={post.feature_image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-mono text-5xl font-bold text-[#d9c9b0] select-none">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 메타 컬럼: 번호 + 날짜↕ + 태그↕ */}
                  <div className="w-9 border-l border-[#e8d9c0] bg-[#fdf6ec] flex flex-col items-center pt-3 pb-2 gap-3 shrink-0">
                    <span className="font-mono text-[11px] font-bold text-[#2d2416] leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="text-[9px] font-mono text-[#b8a898] leading-none tracking-wide"
                      style={{ writingMode: "vertical-rl" }}
                    >
                      {formatDate(post.published_at)}
                    </span>
                    {tag && (
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest text-[#b8a898] leading-none"
                        style={{ writingMode: "vertical-rl" }}
                      >
                        {tag.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* ── 제목 영역 ── */}
                <div className="border-t border-[#e8d9c0] flex-1 flex flex-col">
                  <div
                    className="px-4 pt-3 pb-3 flex-1 transition-colors duration-200"
                    style={{
                      backgroundColor: isHovered ? "#fde68a" : "transparent",
                    }}
                  >
                    <h3 className="font-serif font-bold leading-snug text-[15px] md:text-base text-[#2d2416]">
                      {post.title}
                    </h3>
                  </div>

                  {/* 저자 + 읽기 시간 */}
                  <div className="px-4 pb-3 pt-2 border-t border-[#e8d9c0] flex items-center justify-between gap-2">
                    {/* 저자 */}
                    {post.authors?.[0] && (
                      <div className="flex items-center gap-1.5 min-w-0">
                        {post.authors[0].profile_image ? (
                          <Image
                            src={post.authors[0].profile_image}
                            alt={post.authors[0].name}
                            width={18}
                            height={18}
                            className="rounded-full shrink-0 object-cover"
                          />
                        ) : (
                          <div className="w-[18px] h-[18px] rounded-full bg-[#e8d9c0] shrink-0 flex items-center justify-center">
                            <span className="text-[8px] font-bold text-[#b8a898]">
                              {post.authors[0].name[0]}
                            </span>
                          </div>
                        )}
                        <span className="text-[10px] text-[#b8a898] truncate">
                          {post.authors[0].name}
                        </span>
                      </div>
                    )}
                    {/* 읽기 시간 */}
                    {post.reading_time > 0 && (
                      <span
                        className={`text-[10px] shrink-0 transition-colors duration-200 ${
                          isHovered ? "text-[#92400e]" : "text-[#c8b8a2]"
                        }`}
                      >
                        {post.reading_time}min →
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
