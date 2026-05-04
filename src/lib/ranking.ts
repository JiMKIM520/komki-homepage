import type { EmailMetric } from "./ghost-admin";
import type { RankedSlug } from "./post-views";

/**
 * 두 ranking 데이터(이메일 오픈율 + 페이지뷰)를 순위 평균으로 결합.
 *
 * - 각 데이터셋에 등장한 slug 합집합 → 두 지표 desc 정렬 후 1부터 순위 부여
 * - 한쪽에만 있는 slug는 누락된 쪽에서 "최하위 + 1" 순위로 처리
 * - 평균 순위가 낮은 순(=좋은 순)으로 limit개 slug 반환
 *
 * 두 인프라(Ghost Admin, Upstash Redis) 모두 비어있으면 빈 배열 반환 → 호출 측 폴백.
 */
export function combineRankings(
  emailMetrics: EmailMetric[],
  viewMetrics: RankedSlug[],
  limit: number
): string[] {
  const allSlugs = new Set<string>();
  emailMetrics.forEach((m) => allSlugs.add(m.slug));
  viewMetrics.forEach((m) => allSlugs.add(m.slug));
  if (allSlugs.size === 0) return [];

  const openSorted = [...emailMetrics].sort((a, b) => b.openRate - a.openRate);
  const openRank = new Map<string, number>();
  openSorted.forEach((m, i) => openRank.set(m.slug, i + 1));

  const viewSorted = [...viewMetrics].sort((a, b) => b.views - a.views);
  const viewRank = new Map<string, number>();
  viewSorted.forEach((m, i) => viewRank.set(m.slug, i + 1));

  const fallbackOpen = emailMetrics.length + 1;
  const fallbackView = viewMetrics.length + 1;

  return Array.from(allSlugs)
    .map((slug) => ({
      slug,
      avgRank:
        ((openRank.get(slug) ?? fallbackOpen) +
          (viewRank.get(slug) ?? fallbackView)) /
        2,
    }))
    .sort((a, b) => a.avgRank - b.avgRank)
    .slice(0, limit)
    .map((x) => x.slug);
}
