"use client";

import { useEffect } from "react";

type Props = {
  slug: string;
};

// 글 페이지 mount 시 1회 페이지뷰 트래킹.
// 동일 세션 중복 방지로 sessionStorage 활용.
export default function PostViewTracker({ slug }: Props) {
  useEffect(() => {
    if (!slug) return;

    const sessionKey = `viewed:${slug}`;
    try {
      if (sessionStorage.getItem(sessionKey)) return;
      sessionStorage.setItem(sessionKey, "1");
    } catch {
      // sessionStorage 차단 환경 — 그냥 트래킹 진행
    }

    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {
      // 트래킹 실패는 무시 (사용자 경험 영향 X)
    });
  }, [slug]);

  return null;
}
