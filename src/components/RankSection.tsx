"use client";

import { useState } from "react";
import Link from "next/link";
import { GhostPost } from "@/lib/ghost-types";

function badgeLabel(tagName: string): string {
  const lc = tagName.toLowerCase();
  if (lc.includes("ai")) return "AI";
  if (lc.includes("market") || tagName.includes("마케팅")) return "Marketing";
  if (lc.includes("trend") || tagName.includes("트렌드")) return "Trend";
  if (tagName.includes("스페셜")) return "Special";
  return tagName;
}

export default function RankSection({ posts }: { posts: GhostPost[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const ranked = posts.slice(0, 5);

  if (ranked.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-white" onMouseLeave={() => setHoveredIndex(null)}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* 섹션 라벨 — 검정 알약 */}
        <div className="mb-6 md:mb-8">
          <span className="inline-flex items-center bg-black text-[#FBF8F1] text-sm md:text-base font-paperlogy font-semibold tracking-wide rounded-full px-5 py-2">
            지금 뜨는 콘텐츠
          </span>
        </div>

        {/* 랭킹 리스트 — 컴팩트 보더 */}
        <ul className="border-y-[2px] border-black">
          {ranked.map((post, i) => {
            const tag = post.tags?.[0];
            const isHovered = hoveredIndex === i;
            const isLast = i === ranked.length - 1;
            return (
              <li key={post.id} className={isLast ? "" : "border-b-[2px] border-black"}>
                <Link
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  className="flex items-center gap-3 md:gap-6 py-2 md:py-2.5 transition-colors duration-200"
                  style={{
                    color: isHovered ? "#3F1C03" : "#000000",
                    opacity: isHovered ? 0.8 : 1,
                  }}
                >
                  <span className="font-dm-serif text-2xl md:text-4xl w-10 md:w-16 shrink-0 tabular-nums leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <p className="flex-1 min-w-0 font-paperlogy font-medium text-sm md:text-base truncate">
                    {post.title}
                  </p>

                  {tag && (
                    <span className="shrink-0 font-dm-serif text-[10px] md:text-xs uppercase tracking-wider text-[#FBF8F1] bg-black rounded-full px-2.5 md:px-3 py-0.5 md:py-1">
                      {badgeLabel(tag.name)}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
