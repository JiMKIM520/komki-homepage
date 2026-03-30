"use client";

import { GhostTag } from "@/lib/ghost";

const BG_STYLES = [
  "bg-[#fde68a] text-[#2d2416]",
  "bg-[#fed7aa] text-[#2d2416]",
  "bg-[#d9f99d] text-[#2d2416]",
  "border border-[#e8d9c0] bg-transparent text-[#8b7355]",
] as const;

function getTagSize(postCount: number): string {
  if (postCount >= 10) return "text-xs px-4 py-1.5 font-bold";
  if (postCount >= 5) return "text-[10px] px-3 py-1 font-semibold";
  return "text-[8px] px-2.5 py-1 font-medium";
}

export default function TagSection({ tags }: { tags: GhostTag[] }) {
  if (tags.length === 0) return null;

  return (
    <section className="py-6 border-t border-[#e8d9c0]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* 섹션 헤더 */}
        <span className="text-[10px] font-extrabold text-[#2d2416] tracking-[0.2em] uppercase">
          Tags
        </span>

        {/* 태그 버블 */}
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag, i) => {
            const style = BG_STYLES[i % BG_STYLES.length];
            const size = getTagSize(tag.count?.posts ?? 0);

            return (
              <span
                key={tag.id}
                className={`rounded-full ${style} ${size} transition-transform duration-200 hover:scale-105 hover:shadow-sm cursor-default select-none`}
              >
                {tag.name}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
