"use client";

import { useRef, useEffect } from "react";

type Props = {
  children: React.ReactNode;
  autoplayMs?: number;
};

export default function HorizontalCarousel({ children, autoplayMs = 2000 }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  // 드래그 + 자동 슬라이드 통합 effect (paused 상태 공유)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let isDown = false;
    let isHovering = false;
    let startX = 0;
    let scrollLeftStart = 0;
    let dragMoved = false;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      isDown = true;
      dragMoved = false;
      startX = e.pageX;
      scrollLeftStart = el.scrollLeft;
      el.classList.add("is-grabbing");
    };

    const stopDrag = () => {
      isDown = false;
      el.classList.remove("is-grabbing");
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const walk = e.pageX - startX;
      if (Math.abs(walk) > 5) dragMoved = true;
      el.scrollLeft = scrollLeftStart - walk;
    };

    const onClickCapture = (e: MouseEvent) => {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
        dragMoved = false;
      }
    };

    const onEnter = () => { isHovering = true; };
    const onLeave = () => { isHovering = false; };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", stopDrag);
    el.addEventListener("pointerleave", () => { isHovering = false; stopDrag(); });
    el.addEventListener("pointercancel", stopDrag);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    // 자동 슬라이드 — 첫 카드 폭 + gap 만큼 이동, 끝 도달 시 처음으로 wrap
    let intervalId: ReturnType<typeof setInterval> | null = null;
    if (autoplayMs > 0) {
      intervalId = setInterval(() => {
        if (isDown || isHovering) return;
        const firstCard = el.querySelector<HTMLElement>(":scope > *");
        if (!firstCard) return;
        const gap = 20; // gap-5 desktop 기준 — 모바일 16px와 차이는 작아 영향 미미
        const step = firstCard.offsetWidth + gap;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
        if (atEnd) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          el.scrollBy({ left: step, behavior: "smooth" });
        }
      }, autoplayMs);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", stopDrag);
      el.removeEventListener("pointercancel", stopDrag);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [autoplayMs]);

  return (
    <div
      ref={scrollerRef}
      className="-mx-4 md:mx-0 px-4 md:px-0 flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 md:cursor-grab md:[&.is-grabbing]:cursor-grabbing md:[&.is-grabbing]:select-none"
    >
      {children}
    </div>
  );
}
