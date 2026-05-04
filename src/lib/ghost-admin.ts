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
