"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GhostPost, getPreview } from "@/lib/ghost-types";

type Props = { posts: GhostPost[] };

const ROTATE_INTERVAL = 4000;
const FADE_MS = 1200;
const PREVIEW_CHARS = 200;

export default function HeroArticles({ posts }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || posts.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % posts.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(id);
  }, [paused, posts.length]);

  if (posts.length === 0) return null;

  const n = posts.length;
  const left = posts[index % n];
  const center = posts[(index + 1) % n];
  const right = posts[(index + 2) % n];

  return (
    <section
      className="bg-[#3F1C03] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="주요 콘텐츠"
    >
      {/* ─── 데스크톱: 3슬롯 ─── */}
      <div className="hidden md:flex max-w-[1600px] mx-auto px-6 lg:px-10 pt-8 lg:pt-12 pb-4 lg:pb-6 gap-5 lg:gap-8 items-center justify-center">
        <Slot post={left} aspect="aspect-[4/5]" className="shrink-0 w-[18%] max-w-[280px]" render={renderSide} />
        {/* 가운데: 포스터 위(z-10), 내용박스는 살짝 아래+겹치게 layered 배치 */}
        <div className="shrink-0 w-[52%] max-w-[880px] flex">
          <Slot post={center} aspect="w-1/2 aspect-[4/5] z-10" render={renderPoster} />
          <Slot post={center} aspect="w-1/2 aspect-[4/5] -ml-[3%] mt-[5%]" render={renderContent} />
        </div>
        <Slot post={right} aspect="aspect-[4/5]" className="shrink-0 w-[18%] max-w-[280px]" render={renderSide} />
      </div>

      {/* 데스크톱 dots */}
      <Dots
        className="hidden md:flex"
        posts={posts}
        activeCenterIndex={(index + 1) % n}
        onSelect={(i) => setIndex((i - 1 + n) % n)}
      />

      {/* ─── 모바일: peek carousel (중앙 + 좌우 큰 포스터가 화면 밖으로 잘림) ─── */}
      <div className="md:hidden pt-6 overflow-hidden">
        <div className="flex items-center justify-center gap-3">
          <Slot post={left} aspect="aspect-[4/5]" className="shrink-0 w-[45%] opacity-60 pointer-events-none select-none" render={renderMobilePeek} />
          <Slot post={center} aspect="aspect-[4/5]" className="shrink-0 w-[70%]" render={renderMobileCenter} />
          <Slot post={right} aspect="aspect-[4/5]" className="shrink-0 w-[45%] opacity-60 pointer-events-none select-none" render={renderMobilePeek} />
        </div>
        <Slot
          post={center}
          aspect="min-h-[3rem]"
          className="mt-6 px-6"
          render={(p) => (
            <h2 className="font-paperlogy font-semibold text-xl leading-tight text-[#FBF8F1] text-center line-clamp-2">
              {p.title}
            </h2>
          )}
        />
      </div>

      {/* 모바일 dots */}
      <Dots
        className="flex md:hidden"
        posts={posts}
        activeCenterIndex={(index + 1) % n}
        onSelect={(i) => setIndex((i - 1 + n) % n)}
      />
    </section>
  );
}

/* ─────────── Slot: 크로스페이드 레이어 ─────────── */

function Slot({
  post,
  aspect,
  className = "",
  render,
}: {
  post: GhostPost;
  aspect: string;
  className?: string;
  render: (post: GhostPost) => React.ReactNode;
}) {
  const [currentPost, setCurrentPost] = useState(post);
  const [prevPost, setPrevPost] = useState<GhostPost | null>(null);

  useEffect(() => {
    if (post.id === currentPost.id) return;
    setPrevPost(currentPost);
    setCurrentPost(post);
    const t = setTimeout(() => setPrevPost(null), FADE_MS);
    return () => clearTimeout(t);
  }, [post, currentPost]);

  return (
    <div className={`relative ${aspect || "w-full h-full"} ${className}`}>
      {prevPost && (
        <div
          key={`prev-${prevPost.id}`}
          className="absolute inset-0 animate-out fade-out fill-mode-forwards"
          style={{ animationDuration: `${FADE_MS}ms` }}
        >
          {render(prevPost)}
        </div>
      )}
      <div
        key={`cur-${currentPost.id}`}
        className="absolute inset-0 animate-in fade-in"
        style={{ animationDuration: `${FADE_MS}ms` }}
      >
        {render(currentPost)}
      </div>
    </div>
  );
}

/* ─────────── Dots ─────────── */

function Dots({
  className,
  posts,
  activeCenterIndex,
  onSelect,
}: {
  className: string;
  posts: GhostPost[];
  activeCenterIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className={`justify-center gap-2 pt-3 pb-6 ${className}`}>
      {posts.map((p, i) => {
        const isActive = i === activeCenterIndex;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`${i + 1}번 슬라이드로 이동`}
            aria-current={isActive}
            className={`h-2 rounded-full transition-all duration-300 ${
              isActive ? "w-8 bg-[#FBF8F1]" : "w-2 bg-[#FBF8F1]/30 hover:bg-[#FBF8F1]/50"
            }`}
          />
        );
      })}
    </div>
  );
}

/* ─────────── 카드 렌더러 (Slot.render에 전달) ─────────── */

function renderSide(post: GhostPost) {
  return (
    <Link
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={post.title}
      className="block w-full h-full overflow-hidden"
    >
      {post.feature_image ? (
        <Image
          src={post.feature_image}
          alt={post.title}
          fill
          sizes="22vw"
          className="object-cover scale-[1.025]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-[#FBF8F1]/60 text-5xl font-black">
          komki
        </div>
      )}
    </Link>
  );
}

function renderPoster(post: GhostPost) {
  return (
    <Link
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={post.title}
      className="block w-full h-full overflow-hidden"
    >
      {post.feature_image ? (
        <Image
          src={post.feature_image}
          alt={post.title}
          fill
          sizes="26vw"
          className="object-cover scale-[1.025]"
          priority
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-[#FBF8F1]/60 text-5xl font-black">
          komki
        </div>
      )}
    </Link>
  );
}

function renderContent(post: GhostPost) {
  const preview = getPreview(post, PREVIEW_CHARS);
  return (
    <Link
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={post.title}
      className="block w-full h-full bg-white flex flex-col overflow-hidden"
    >
      {/* 제목 — 검정 배경 */}
      <div className="bg-black text-white px-6 lg:px-8 py-6 lg:py-7">
        <h2 className="font-paperlogy font-semibold text-xl lg:text-[28px] leading-tight line-clamp-3">
          {post.title}
        </h2>
      </div>
      {/* 본문 + 읽어보기 */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-6 lg:py-8 min-h-0">
        {preview && (
          <p className="mt-3 lg:mt-4 font-paperlogy text-sm lg:text-base text-black leading-relaxed line-clamp-6">
            {preview}
          </p>
        )}
        <div className="mt-auto pt-4 flex justify-end">
          <span className="inline-flex items-center gap-1.5 font-paperlogy text-sm lg:text-base font-semibold tracking-wide bg-black text-white rounded-full px-5 lg:px-6 py-2 lg:py-2.5">
            읽어보기 →
          </span>
        </div>
      </div>
    </Link>
  );
}

function renderMobileCenter(post: GhostPost) {
  return (
    <Link
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={post.title}
      className="block w-full h-full overflow-hidden"
    >
      {post.feature_image ? (
        <Image
          src={post.feature_image}
          alt={post.title}
          fill
          sizes="66vw"
          className="object-cover scale-[1.025]"
          priority
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-[#FBF8F1]/60 text-5xl font-black">
          komki
        </div>
      )}
    </Link>
  );
}

function renderMobilePeek(post: GhostPost) {
  return (
    <div className="w-full h-full overflow-hidden" aria-hidden>
      {post.feature_image && (
        <Image
          src={post.feature_image}
          alt=""
          fill
          sizes="15vw"
          className="object-cover scale-[1.025]"
        />
      )}
    </div>
  );
}
