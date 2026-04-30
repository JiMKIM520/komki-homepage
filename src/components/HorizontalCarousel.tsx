"use client";

import { useRef, useState, useEffect } from "react";

type Props = {
  children: React.ReactNode;
  scrollAmount?: number;
};

export default function HorizontalCarousel({ children, scrollAmount = 600 }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollBy = (dir: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* 좌측 화살표 — 데스크톱 전용, 스크롤 가능할 때만 */}
      <button
        type="button"
        aria-label="이전"
        onClick={() => scrollBy(-1)}
        disabled={!canScrollLeft}
        className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black text-white items-center justify-center shadow-lg transition-opacity ${
          canScrollLeft ? "opacity-90 hover:opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* 우측 화살표 */}
      <button
        type="button"
        aria-label="다음"
        onClick={() => scrollBy(1)}
        disabled={!canScrollRight}
        className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black text-white items-center justify-center shadow-lg transition-opacity ${
          canScrollRight ? "opacity-90 hover:opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* 가로 스크롤 컨테이너 */}
      <div
        ref={scrollerRef}
        className="-mx-4 md:mx-0 px-4 md:px-0 flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 scroll-smooth"
      >
        {children}
      </div>
    </div>
  );
}
