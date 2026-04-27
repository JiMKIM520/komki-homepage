"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  { label: "모든 콘텐츠", href: "/articles" },
  { label: "AI", href: "/articles?tag=ai" },
  { label: "Marketing", href: "/articles?tag=marketing" },
  { label: "Trend", href: "/articles?tag=trend" },
  { label: "콤키 스페셜", href: "/articles?tag=seupesyeol" },
] as const;

export default function Navbar() {
  const [showTopBar, setShowTopBar] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileContentOpen, setMobileContentOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 스크롤 다운 시 최상단 바 숨김
  useEffect(() => {
    const onScroll = () => setShowTopBar(window.scrollY < 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ESC 키로 오버레이 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileMenuOpen(false);
      setMobileContentOpen(false);
      setDropdownOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 데스크톱 드롭다운 외부 클릭 닫기
  useEffect(() => {
    if (!dropdownOpen) return;
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [dropdownOpen]);

  // 모바일 메뉴 오픈 시 body 스크롤 잠금
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setMobileContentOpen(false);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
  };

  return (
    <>
      {/* ── 최상단 얇은 바 (스크롤 시 숨김) ── */}
      <div
        className={`bg-[#FBF8F1] border-b border-black/10 overflow-hidden transition-[height,opacity] duration-300 ${
          showTopBar ? "h-9 opacity-100" : "h-0 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-9 flex items-center justify-end gap-4 text-[11px] md:text-xs text-[#3F1C03]">
          <Link href="/about" className="hover:text-black transition-colors">
            콤키 소개
          </Link>
          <span className="text-[#3F1C03]/30">|</span>
          <Link href="#subscribe" className="hover:text-black transition-colors">
            뉴스레터 무료 구독
          </Link>
        </div>
      </div>

      {/* ── 메인 Navbar (sticky) ── */}
      <header className="sticky top-0 z-40 bg-black text-[#FBF8F1]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-12 md:h-14 flex items-center justify-between gap-2 md:gap-4 relative">
          {/* 좌측: 햄버거(mobile) / 로고 + 콘텐츠 보기 드롭다운(desktop) */}
          <div className="flex items-center gap-3">
            {/* 모바일 햄버거 */}
            <button
              type="button"
              className="md:hidden p-1 text-[#FBF8F1]"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="메뉴 열기"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>

            {/* 데스크톱: 브랜드 아이콘 + 콘텐츠 보기 드롭다운 */}
            <div className="hidden md:flex items-center gap-3" ref={dropdownRef}>
              <Link href="/" aria-label="komki 홈">
                <Image
                  src="/brand-logo.svg"
                  alt="komki"
                  width={30}
                  height={32}
                  priority
                  className="brightness-0 invert"
                />
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="inline-flex items-center gap-2 text-sm md:text-base font-noto-sans font-medium text-[#FBF8F1]/90 hover:text-[#FBF8F1] transition-colors"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                >
                  콘텐츠 보기
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M1 3.5l4 4 4-4" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div
                    role="menu"
                    className="absolute top-full mt-2 left-0 bg-[#FBF8F1] text-black rounded-xl shadow-xl py-2 min-w-[180px] border border-black/10"
                  >
                    {CATEGORIES.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        role="menuitem"
                        className="block px-4 py-2 text-sm font-noto-sans font-medium hover:bg-[#3F1C03]/10 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 중앙: KOMKI 로고 */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#FBF8F1] text-3xl md:text-4xl leading-none"
            style={{ fontFamily: "var(--font-brand)" }}
          >
            KOMKI
          </Link>

          {/* 우측: 검색 */}
          <div className="flex items-center">
            {/* 모바일 검색 아이콘 */}
            <button type="button" className="md:hidden p-1 text-[#FBF8F1]" aria-label="검색">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            {/* 데스크톱 검색 input */}
            <form
              onSubmit={submitSearch}
              className="hidden md:flex items-center bg-white rounded-full pl-4 pr-1 h-8 w-[240px]"
            >
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent text-sm text-black placeholder-[#3F1C03]/50 outline-none flex-1 min-w-0"
              />
              <button
                type="submit"
                className="shrink-0 p-1.5 rounded-full text-black hover:bg-black/5 transition-colors"
                aria-label="검색"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ── 모바일 풀스크린 햄버거 오버레이 ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FBF8F1] text-black md:hidden flex flex-col overflow-y-auto">
          <div className="flex justify-end p-5">
            <button
              type="button"
              onClick={closeMobile}
              aria-label="메뉴 닫기"
              className="p-1"
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex flex-col items-stretch justify-start pt-4 pb-20 text-2xl font-bold">
            {/* 콘텐츠 보기 (드롭다운) */}
            <div>
              <button
                type="button"
                onClick={() => setMobileContentOpen((v) => !v)}
                className="w-full py-6 flex flex-col items-center gap-1.5"
                aria-expanded={mobileContentOpen}
              >
                <span>콘텐츠 보기</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className={`transition-transform ${mobileContentOpen ? "rotate-180" : ""}`}
                >
                  <path d="M2 5l5 5 5-5" />
                </svg>
              </button>
              {mobileContentOpen && (
                <div className="bg-white text-black py-10 flex flex-col items-center gap-8">
                  {CATEGORIES.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-2xl"
                      onClick={closeMobile}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              onClick={closeMobile}
              className="w-full py-6 text-center"
            >
              콤키 소개
            </Link>

            <Link
              href="#subscribe"
              onClick={closeMobile}
              className="w-full py-6 text-center"
            >
              뉴스레터 무료 구독
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
