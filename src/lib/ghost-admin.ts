import "server-only";
// @ts-expect-error - @tryghost/admin-api 공식 타입 정의 미제공
import GhostAdminAPI from "@tryghost/admin-api";

// Vercel/로컬 env에 GHOST_ADMIN_API_KEY (<id>:<secret>)가 있으면 클라이언트 생성.
// 없으면 null로 두고 호출 측에서 graceful 폴백.
const adminClient =
  process.env.GHOST_ADMIN_API_KEY && process.env.GHOST_URL
    ? new GhostAdminAPI({
        url: process.env.GHOST_URL,
        key: process.env.GHOST_ADMIN_API_KEY,
        version: "v5.0",
      })
    : null;

export type EmailMetric = {
  slug: string;
  openRate: number; // 0~1
  deliveredCount: number;
};

type AdminPost = {
  slug: string;
  email?: {
    delivered_count?: number;
    opened_count?: number;
  } | null;
};

/**
 * 최근 N일 동안 published된 글 중 newsletter로 발송된 글의 email metrics fetch.
 * 발송 안 된 글(email 필드 없음)은 제외.
 */
export async function getPostsWithEmailMetrics(
  days = 30
): Promise<EmailMetric[]> {
  if (!adminClient) return [];
  try {
    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() - days);
    const cutoffStr = cutoff.toISOString().slice(0, 10);

    const posts = (await adminClient.posts.browse({
      limit: 50,
      filter: `status:published+published_at:>'${cutoffStr}'`,
      include: "email",
    })) as AdminPost[];

    return posts
      .filter(
        (p) =>
          p.email &&
          typeof p.email.delivered_count === "number" &&
          p.email.delivered_count > 0
      )
      .map((p) => {
        const delivered = p.email!.delivered_count ?? 0;
        const opened = p.email!.opened_count ?? 0;
        return {
          slug: p.slug,
          openRate: delivered > 0 ? opened / delivered : 0,
          deliveredCount: delivered,
        };
      });
  } catch (error) {
    console.error("getPostsWithEmailMetrics error:", error);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// 풀 메트릭 + 멤버 통계 (admin 대시보드용)
// ─────────────────────────────────────────────────────────────

type AdminPostFull = {
  id: string;
  slug: string;
  title: string;
  published_at: string | null;
  email?: {
    email_count?: number;
    delivered_count?: number;
    opened_count?: number;
    failed_count?: number;
  } | null;
  count?: {
    clicks?: number;
    signups?: number;
    paid_conversions?: number;
    positive_feedback?: number;
    negative_feedback?: number;
  };
};

export type PostMetrics = {
  slug: string;
  title: string;
  publishedAt: string | null;
  emailCount: number;
  deliveredCount: number;
  openedCount: number;
  openRate: number;
  clicks: number;
  signups: number;
  paidConversions: number;
  positiveFeedback: number;
  negativeFeedback: number;
};

/**
 * 전체 published 글의 full metrics (email + 클릭/가입/유료전환/피드백).
 * 발송 안 된 글도 포함 — 메트릭은 0으로.
 */
export async function getPostsWithFullMetrics(): Promise<PostMetrics[]> {
  if (!adminClient) return [];
  try {
    const posts = (await adminClient.posts.browse({
      limit: "all",
      filter: "status:published",
      include:
        "email,count.signups,count.paid_conversions,count.clicks,count.positive_feedback,count.negative_feedback",
    })) as AdminPostFull[];

    return posts.map((p) => {
      const delivered = p.email?.delivered_count ?? 0;
      const opened = p.email?.opened_count ?? 0;
      return {
        slug: p.slug,
        title: p.title,
        publishedAt: p.published_at,
        emailCount: p.email?.email_count ?? 0,
        deliveredCount: delivered,
        openedCount: opened,
        openRate: delivered > 0 ? opened / delivered : 0,
        clicks: p.count?.clicks ?? 0,
        signups: p.count?.signups ?? 0,
        paidConversions: p.count?.paid_conversions ?? 0,
        positiveFeedback: p.count?.positive_feedback ?? 0,
        negativeFeedback: p.count?.negative_feedback ?? 0,
      };
    });
  } catch (error) {
    console.error("getPostsWithFullMetrics error:", error);
    return [];
  }
}

export type MemberStats = {
  total: number;
  free: number;
  paid: number;
  comped: number;
};

type BrowseMeta = {
  meta?: { pagination?: { total?: number } };
};

/**
 * 구독자 통계 (전체 / 무료 / 유료 / comped).
 */
export async function getMemberStats(): Promise<MemberStats | null> {
  if (!adminClient) return null;
  try {
    const [allRes, freeRes, paidRes, compedRes] = await Promise.all([
      adminClient.members.browse({ limit: 1 }),
      adminClient.members.browse({ limit: 1, filter: "status:free" }),
      adminClient.members.browse({ limit: 1, filter: "status:paid" }),
      adminClient.members.browse({ limit: 1, filter: "status:comped" }),
    ]);
    const total =
      (allRes as unknown as BrowseMeta).meta?.pagination?.total ?? 0;
    const free =
      (freeRes as unknown as BrowseMeta).meta?.pagination?.total ?? 0;
    const paid =
      (paidRes as unknown as BrowseMeta).meta?.pagination?.total ?? 0;
    const comped =
      (compedRes as unknown as BrowseMeta).meta?.pagination?.total ?? 0;
    return { total, free, paid, comped };
  } catch (error) {
    console.error("getMemberStats error:", error);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 신규 가입 / 예약 발송 / 태그별 통계
// ─────────────────────────────────────────────────────────────

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().replace(/\.\d{3}Z$/, "Z");
}

export type MemberGrowth = {
  last1: number;
  last7: number;
  last30: number;
};

/**
 * 최근 N일 신규 가입자 수 (1일/7일/30일).
 */
export async function getMemberGrowth(): Promise<MemberGrowth | null> {
  if (!adminClient) return null;
  try {
    const [d1, d7, d30] = await Promise.all([
      adminClient.members.browse({
        limit: 1,
        filter: `created_at:>'${isoDaysAgo(1)}'`,
      }),
      adminClient.members.browse({
        limit: 1,
        filter: `created_at:>'${isoDaysAgo(7)}'`,
      }),
      adminClient.members.browse({
        limit: 1,
        filter: `created_at:>'${isoDaysAgo(30)}'`,
      }),
    ]);
    return {
      last1: (d1 as unknown as BrowseMeta).meta?.pagination?.total ?? 0,
      last7: (d7 as unknown as BrowseMeta).meta?.pagination?.total ?? 0,
      last30: (d30 as unknown as BrowseMeta).meta?.pagination?.total ?? 0,
    };
  } catch (error) {
    console.error("getMemberGrowth error:", error);
    return null;
  }
}

type AdminScheduledPost = {
  id: string;
  slug: string;
  title: string;
  published_at: string | null;
};

export type ScheduledPost = {
  id: string;
  slug: string;
  title: string;
  scheduledAt: string | null;
};

/**
 * 예약 발송될 글 목록 (status:scheduled).
 */
export async function getScheduledPosts(): Promise<ScheduledPost[]> {
  if (!adminClient) return [];
  try {
    const posts = (await adminClient.posts.browse({
      limit: 20,
      filter: "status:scheduled",
      order: "published_at asc",
    })) as AdminScheduledPost[];
    return posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      scheduledAt: p.published_at,
    }));
  } catch (error) {
    console.error("getScheduledPosts error:", error);
    return [];
  }
}

type AdminTag = {
  id: string;
  name: string;
  slug: string;
  count?: { posts?: number };
};

export type TagStat = {
  name: string;
  slug: string;
  postCount: number;
  avgOpenRate: number; // 0~1 (최근 30일 발송 글 기준)
  totalClicks: number;
  totalSignups: number;
};

/**
 * 태그별 통계: 글 수 + 30일 평균 오픈율 + 총 클릭/가입.
 * fullMetrics를 그대로 받아 태그 매핑 후 집계 (post fetch 1번 추가만).
 */
export async function getTagStats(
  fullMetrics: PostMetrics[]
): Promise<TagStat[]> {
  if (!adminClient) return [];
  try {
    // 1) 모든 태그
    const tags = (await adminClient.tags.browse({
      limit: "all",
      include: "count.posts",
    })) as AdminTag[];

    // 2) 전체 published 글의 태그 매핑 (posts API에 include:tags)
    type PostWithTags = {
      slug: string;
      tags?: { slug: string }[];
    };
    const recentPosts = (await adminClient.posts.browse({
      limit: "all",
      filter: "status:published",
      include: "tags",
      fields: "slug",
    })) as PostWithTags[];

    const slugToTags = new Map<string, string[]>();
    for (const p of recentPosts) {
      slugToTags.set(p.slug, (p.tags ?? []).map((t) => t.slug));
    }

    // 3) 메트릭과 결합: 태그별 합산
    const acc = new Map<
      string,
      { openSum: number; openCount: number; clicks: number; signups: number }
    >();
    for (const m of fullMetrics) {
      const tagSlugs = slugToTags.get(m.slug) ?? [];
      for (const ts of tagSlugs) {
        const cur = acc.get(ts) ?? {
          openSum: 0,
          openCount: 0,
          clicks: 0,
          signups: 0,
        };
        if (m.deliveredCount > 0) {
          cur.openSum += m.openRate;
          cur.openCount += 1;
        }
        cur.clicks += m.clicks;
        cur.signups += m.signups;
        acc.set(ts, cur);
      }
    }

    return tags
      .map((t) => {
        const a = acc.get(t.slug);
        return {
          name: t.name,
          slug: t.slug,
          postCount: t.count?.posts ?? 0,
          avgOpenRate: a && a.openCount > 0 ? a.openSum / a.openCount : 0,
          totalClicks: a?.clicks ?? 0,
          totalSignups: a?.signups ?? 0,
        };
      })
      .filter((t) => t.postCount > 0)
      .sort((a, b) => b.postCount - a.postCount);
  } catch (error) {
    console.error("getTagStats error:", error);
    return [];
  }
}

export type WeekdayStat = {
  weekday: number; // 0=일 ... 6=토
  label: string;
  postCount: number;
  avgOpenRate: number;
};

/**
 * 요일별 발행 글 평균 오픈율 (이미 받은 fullMetrics 활용).
 */
export function getWeekdayStats(fullMetrics: PostMetrics[]): WeekdayStat[] {
  const labels = ["일", "월", "화", "수", "목", "금", "토"];
  const acc: { sum: number; count: number }[] = Array.from(
    { length: 7 },
    () => ({ sum: 0, count: 0 })
  );
  for (const m of fullMetrics) {
    if (m.deliveredCount <= 0 || !m.publishedAt) continue;
    const wd = new Date(m.publishedAt).getUTCDay();
    acc[wd].sum += m.openRate;
    acc[wd].count += 1;
  }
  return acc.map((a, i) => ({
    weekday: i,
    label: labels[i],
    postCount: a.count,
    avgOpenRate: a.count > 0 ? a.sum / a.count : 0,
  }));
}
