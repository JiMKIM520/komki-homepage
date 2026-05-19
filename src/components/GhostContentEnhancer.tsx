"use client";

import { useEffect } from "react";

// Ghost 본문은 HTML 문자열로 주입돼 React 이벤트가 붙지 않음.
// Ghost 기본 테마가 제공하는 toggle 카드 펼침/접힘 동작을 헤드리스 환경에서 재현.
export default function GhostContentEnhancer() {
  useEffect(() => {
    const toggles = Array.from(
      document.querySelectorAll<HTMLElement>(".komki-prose .kg-toggle-card")
    );

    const cleanups = toggles.map((card) => {
      const heading = card.querySelector<HTMLElement>(".kg-toggle-heading");
      if (!heading) return () => {};

      // Ghost가 상태 속성을 안 넣은 경우 기본 닫힘으로 초기화
      if (!card.getAttribute("data-kg-toggle-state")) {
        card.setAttribute("data-kg-toggle-state", "close");
      }

      const onClick = () => {
        const next =
          card.getAttribute("data-kg-toggle-state") === "open"
            ? "close"
            : "open";
        card.setAttribute("data-kg-toggle-state", next);
      };

      heading.addEventListener("click", onClick);
      return () => heading.removeEventListener("click", onClick);
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
