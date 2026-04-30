"use client";

import { useRef, useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function HorizontalCarousel({ children }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;
    let dragMoved = false;

    const onPointerDown = (e: PointerEvent) => {
      // 마우스 좌클릭만 (터치는 native overflow-x-auto가 처리)
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      isDown = true;
      dragMoved = false;
      startX = e.pageX;
      scrollLeftStart = el.scrollLeft;
      el.classList.add("is-grabbing");
    };

    const stop = () => {
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

    // 드래그 후 클릭이 자식 Link로 전파되지 않도록 capture-phase에서 차단
    const onClickCapture = (e: MouseEvent) => {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
        dragMoved = false;
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", stop);
    el.addEventListener("pointerleave", stop);
    el.addEventListener("pointercancel", stop);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", stop);
      el.removeEventListener("pointerleave", stop);
      el.removeEventListener("pointercancel", stop);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  return (
    <div
      ref={scrollerRef}
      className="-mx-4 md:mx-0 px-4 md:px-0 flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 md:cursor-grab md:[&.is-grabbing]:cursor-grabbing md:[&.is-grabbing]:select-none scroll-smooth md:[&.is-grabbing]:scroll-auto"
    >
      {children}
    </div>
  );
}
