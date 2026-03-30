"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GhostPost } from "@/lib/ghost";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// 슬라이드별 배경색
const BG_COLORS = ["#fde68a", "#fed7aa", "#d9f99d"] as const;

export default function HeroArticles({ posts }: { posts: GhostPost[] }) {
  const [current, setCurrent] = useState(0);
  const post = posts[current];
  if (!post) return null;

  const tag = post.tags?.[0];
  const bg = BG_COLORS[current % BG_COLORS.length];
  const total = posts.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <section className="border-b border-[#e8d9c0] overflow-hidden">
      <div
        className="flex flex-col md:flex-row"
        style={{ minHeight: 460 }}
      >
        {/* ── 왼쪽: 브랜드 마크 ── */}
        <div className="hidden md:flex w-64 lg:w-72 shrink-0 border-r border-[#e8d9c0] flex-col items-center justify-center gap-5 py-10 px-6 bg-[#fdf6ec]">
          {/* 원형 마크 */}
          <div className="w-44 h-44 rounded-full border-[3px] border-[#2d2416] flex flex-col items-center justify-center select-none gap-0">
            <span
              className="font-serif leading-none tracking-tighter text-[#2d2416]"
              style={{ fontSize: 48, fontWeight: 900 }}
            >
              kom
            </span>
            <span
              className="font-serif leading-none tracking-tighter text-[#2d2416]"
              style={{ fontSize: 48, fontWeight: 900 }}
            >
              ki
            </span>
          </div>

          {/* 태그라인 */}
          <div className="text-center space-y-0.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#a08060]">
              창업자를 위한
            </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#a08060]">
              비즈니스 레터
            </p>
          </div>

          {/* 카테고리 리스트 */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-2">
            {["트렌드", "마케팅", "AI", "브랜드"].map((c) => (
              <span
                key={c}
                className="text-[9px] font-bold border border-[#d9c9b0] rounded-full px-2.5 py-0.5 text-[#8b7355]"
              >
                #{c}
              </span>
            ))}
          </div>
        </div>

        {/* ── 오른쪽: 피처드 카드 ── */}
        <div className="flex-1 flex flex-col">
          {/* 카드 본체 */}
          <div
            className="flex-1 flex relative"
            style={{ backgroundColor: bg, transition: "background-color 0.4s ease" }}
          >
            {/* FEATURED 뱃지 */}
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-[#2d2416] text-[#fdf6ec] text-[7px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                Featured
              </span>
            </div>
            {/* 세로 태그 */}
            {tag && (
              <div className="w-8 shrink-0 flex items-center justify-center border-r border-black/10">
                <span
                  className="text-[9px] font-bold uppercase tracking-widest text-[#5c4a2f]"
                  style={{ writingMode: "vertical-rl" }}
                >
                  {tag.name}
                </span>
              </div>
            )}

            {/* 썸네일 */}
            <div className="relative w-[42%] md:w-[48%] shrink-0 overflow-hidden" style={{ aspectRatio: "3/4" }}>
              {post.feature_image ? (
                <Image
                  src={post.feature_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 42vw, 32vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#e8d9c0]">
                  <span className="font-mono text-7xl font-black text-[#d9c9b0] select-none">
                    {String(current + 1).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>

            {/* 텍스트 */}
            <div className="flex-1 flex flex-col justify-between p-5 md:p-8">
              <div className="flex flex-col gap-3">
                {/* 날짜 */}
                <p className="font-mono text-[11px] text-[#7c5c38] tracking-wider">
                  {formatDate(post.published_at)}
                </p>

                {/* 제목 — 흰 반투명 하이라이트 */}
                <h2 className="font-serif font-black text-xl md:text-2xl lg:text-[28px] text-[#2d2416] leading-tight">
                  <span
                    className="px-1 box-decoration-clone"
                    style={{ backgroundColor: "rgba(255,255,255,0.65)" }}
                  >
                    {post.title}
                  </span>
                </h2>

                {/* 발췌 */}
                {post.excerpt && (
                  <p className="hidden md:block text-sm text-[#5c4a2f] leading-relaxed line-clamp-3 mt-1">
                    {post.excerpt}
                  </p>
                )}
              </div>

              {/* GO 버튼 */}
              <div className="mt-6 self-end">
                <Link
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-[#2d2416] rounded-full px-5 py-2 text-[11px] font-black tracking-widest text-[#2d2416] hover:bg-[#2d2416] hover:text-white transition-colors duration-200"
                >
                  GO! →
                </Link>
              </div>
            </div>
          </div>

          {/* ── 네비게이션 ── */}
          <div className="flex items-center justify-between px-5 py-3 bg-[#fdf6ec] border-t border-[#e8d9c0]">
            <span className="font-mono text-[11px] text-[#c8b8a2]">
              {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="text-[11px] font-bold tracking-widest text-[#2d2416] hover:text-[#d97706] transition-colors"
              >
                ‹ PREV
              </button>

              {/* 도트 인디케이터 */}
              <div className="flex items-center gap-1.5">
                {posts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className="rounded-full transition-all duration-200"
                    style={{
                      width: i === current ? 16 : 6,
                      height: 6,
                      backgroundColor: i === current ? "#d97706" : "#e8d9c0",
                    }}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="text-[11px] font-bold tracking-widest text-[#2d2416] hover:text-[#d97706] transition-colors"
              >
                NEXT ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
