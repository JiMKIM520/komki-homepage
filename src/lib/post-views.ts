import "server-only";
import { redis } from "./redis";

// 일별 zset 키: views:YYYY-MM-DD (member=slug, score=count)
const dayKey = (date: Date): string =>
  `views:${date.toISOString().slice(0, 10)}`;

const RETENTION_SECONDS = 60 * 60 * 24 * 35; // 35일 (30일 윈도우 + 5일 마진)

export async function recordView(slug: string): Promise<void> {
  if (!redis) return;
  try {
    const key = dayKey(new Date());
    await redis.zincrby(key, 1, slug);
    await redis.expire(key, RETENTION_SECONDS);
  } catch (error) {
    console.error("recordView error:", error);
  }
}

export type RankedSlug = { slug: string; views: number };

export async function getTopPosts(
  days = 30,
  limit = 5
): Promise<RankedSlug[]> {
  const client = redis;
  if (!client) return [];
  try {
    const now = new Date();
    const keys: string[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(now);
      d.setUTCDate(d.getUTCDate() - i);
      keys.push(dayKey(d));
    }

    // 30일치 zset을 Promise.all로 병렬 fetch
    const results = await Promise.all(
      keys.map((key) => client.zrange(key, 0, -1, { withScores: true }))
    );

    const aggregate = new Map<string, number>();
    for (const entries of results) {
      if (!Array.isArray(entries)) continue;
      // Upstash zrange withScores 반환: [member, score, member, score, ...]
      for (let i = 0; i < entries.length; i += 2) {
        const slug = String(entries[i]);
        const score = Number(entries[i + 1] ?? 0);
        if (!slug) continue;
        aggregate.set(slug, (aggregate.get(slug) ?? 0) + score);
      }
    }

    return Array.from(aggregate.entries())
      .map(([slug, views]) => ({ slug, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  } catch (error) {
    console.error("getTopPosts error:", error);
    return [];
  }
}

export type DailyTotal = { date: string; total: number };

/**
 * 최근 N일 사이트 전체 일별 페이지뷰 합계 (오래된 → 최신 순).
 */
export async function getDailyTotals(days = 30): Promise<DailyTotal[]> {
  const client = redis;
  if (!client) return [];
  try {
    const now = new Date();
    const dates: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setUTCDate(d.getUTCDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }

    const results = await Promise.all(
      dates.map((date) =>
        client.zrange(`views:${date}`, 0, -1, { withScores: true })
      )
    );

    return dates.map((date, idx) => {
      const entries = results[idx];
      let total = 0;
      if (Array.isArray(entries)) {
        for (let i = 1; i < entries.length; i += 2) {
          total += Number(entries[i] ?? 0);
        }
      }
      return { date, total };
    });
  } catch (error) {
    console.error("getDailyTotals error:", error);
    return [];
  }
}

export type DailyViews = { date: string; views: number };

/**
 * 특정 글의 최근 N일 일별 페이지뷰 (오래된 → 최신 순).
 */
export async function getViewsByDay(
  slug: string,
  days = 30
): Promise<DailyViews[]> {
  const client = redis;
  if (!client) return [];
  try {
    const now = new Date();
    const dates: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setUTCDate(d.getUTCDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }

    const scores = await Promise.all(
      dates.map((date) => client.zscore(`views:${date}`, slug))
    );

    return dates.map((date, idx) => ({
      date,
      views: Number(scores[idx] ?? 0),
    }));
  } catch (error) {
    console.error("getViewsByDay error:", error);
    return [];
  }
}
