// 클라이언트 컴포넌트에서도 안전하게 import할 수 있는 타입 + 순수 유틸.
// @tryghost/content-api를 직접 import하는 `ghost.ts`는 서버 컴포넌트에서만 사용.

export type GhostPost = {
  id: string;
  title: string;
  slug: string;
  url: string;
  excerpt: string | null;
  plaintext: string | null;
  feature_image: string | null;
  feature_image_alt: string | null;
  published_at: string | null;
  reading_time: number;
  tags: Array<{ id: string; name: string; slug: string }>;
  authors: Array<{ id: string; name: string; slug: string; profile_image: string | null }>;
  visibility: string;
};

export type GhostTag = {
  id: string;
  name: string;
  slug: string;
  count?: { posts: number };
};

// 본문 plaintext에서 앞 N자 추출. 없으면 excerpt, 그것도 없으면 빈 문자열.
export function getPreview(post: GhostPost, maxChars = 120): string {
  const raw = (post.plaintext || post.excerpt || "").trim();
  if (!raw) return "";
  const normalized = raw.replace(/\s+/g, " ");
  if (normalized.length <= maxChars) return normalized;
  return normalized.slice(0, maxChars).trimEnd() + "…";
}
