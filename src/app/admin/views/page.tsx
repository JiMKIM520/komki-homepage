import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopPosts, getDailyTotals, getViewsByDay } from "@/lib/post-views";
import { getPostsBySlugs } from "@/lib/ghost";
import {
  getPostsWithFullMetrics,
  getMemberStats,
  getMemberGrowth,
  getTagStats,
  type PostMetrics,
} from "@/lib/ghost-admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Views Admin — komki",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ token?: string; slug?: string }>;
};

function formatDate(date: string): string {
  // YYYY-MM-DD → M/D
  const [, m, d] = date.split("-");
  return `${parseInt(m)}/${parseInt(d)}`;
}

export default async function AdminViewsPage({ searchParams }: PageProps) {
  const { token, slug: detailSlug } = await searchParams;
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || token !== expected) notFound();

  const [
    topRaw,
    daily30,
    daily7,
    ghostMetrics,
    members,
    growth,
  ] = await Promise.all([
    getTopPosts(30, 50),
    getDailyTotals(30),
    getDailyTotals(7),
    getPostsWithFullMetrics(),
    getMemberStats(),
    getMemberGrowth(),
  ]);

  const metricsBySlug = new Map<string, PostMetrics>(
    ghostMetrics.map((m) => [m.slug, m])
  );

  const tagStats = await getTagStats(ghostMetrics);

  const slugSet = new Set(topRaw.map((t) => t.slug));
  if (detailSlug) slugSet.add(detailSlug);
  const posts = await getPostsBySlugs(Array.from(slugSet));
  const postMap = new Map(posts.map((p) => [p.slug, p]));

  // 어제 페이지뷰 (오늘 제외 가장 최근 일자)
  const yesterday = daily30.length >= 2 ? daily30[daily30.length - 2] : null;
  const total30 = daily30.reduce((sum, d) => sum + d.total, 0);
  const total7 = daily7.reduce((sum, d) => sum + d.total, 0);
  const avgDaily = daily30.length > 0 ? Math.round(total30 / daily30.length) : 0;

  const detail = detailSlug
    ? {
        slug: detailSlug,
        post: postMap.get(detailSlug),
        views: await getViewsByDay(detailSlug, 30),
        metrics: metricsBySlug.get(detailSlug) ?? null,
      }
    : null;

  return (
    <main className="min-h-screen bg-[#FBF8F1] py-10 md:py-14 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 md:mb-12">
          <p className="font-paperlogy text-xs md:text-sm text-black/50 mb-1">
            komki admin
          </p>
          <h1 className="font-paperlogy font-semibold text-2xl md:text-4xl text-black">
            페이지뷰 대시보드
          </h1>
          <p className="mt-2 font-paperlogy text-sm md:text-base text-[#3F1C03]">
            페이지뷰 30일 (Upstash) · Ghost 메트릭 전체 기간
          </p>
        </header>

        {/* 구독자 카드 (Ghost Members) */}
        {members && (
          <section className="mb-6 md:mb-8">
            <h2 className="font-paperlogy text-xs md:text-sm text-black/50 mb-2 uppercase tracking-wider">
              구독자
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              <Card label="총 구독자" value={members.total} />
              <Card label="무료" value={members.free} />
              <Card label="유료" value={members.paid} />
              <Card label="comped" value={members.comped} />
            </div>
          </section>
        )}

        {/* 신규 가입 추이 */}
        {growth && (
          <section className="mb-6 md:mb-8">
            <h2 className="font-paperlogy text-xs md:text-sm text-black/50 mb-2 uppercase tracking-wider">
              신규 가입
            </h2>
            <div className="grid grid-cols-3 gap-3 md:gap-5">
              <Card label="어제 ~ 오늘 (24h)" value={growth.last1} />
              <Card label="지난 7일" value={growth.last7} />
              <Card label="지난 30일" value={growth.last30} />
            </div>
          </section>
        )}

        {/* 요약 카드 (페이지뷰) */}
        <section className="mb-8 md:mb-12">
          <h2 className="font-paperlogy text-xs md:text-sm text-black/50 mb-2 uppercase tracking-wider">
            페이지뷰
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            <Card label="30일 합계" value={total30} />
            <Card label="7일 합계" value={total7} />
            <Card label="일평균 (30d)" value={avgDaily} />
            <Card
              label="어제"
              value={yesterday?.total ?? 0}
              sub={yesterday ? formatDate(yesterday.date) : ""}
            />
          </div>
        </section>

        {/* 태그별 성과 */}
        {tagStats.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2 className="font-paperlogy font-semibold text-lg md:text-2xl text-black mb-4">
              태그별 성과
            </h2>
            <div className="overflow-x-auto bg-white border border-black/10 rounded-lg">
              <table className="w-full font-paperlogy text-xs md:text-sm">
                <thead className="bg-black text-[#FBF8F1]">
                  <tr>
                    <th className="px-2 md:px-3 py-3 text-left font-semibold">태그</th>
                    <th className="px-2 md:px-3 py-3 text-right font-semibold w-20">글 수</th>
                    <th className="px-2 md:px-3 py-3 text-right font-semibold w-24">평균 오픈율</th>
                    <th className="px-2 md:px-3 py-3 text-right font-semibold w-20 hidden md:table-cell">클릭</th>
                    <th className="px-2 md:px-3 py-3 text-right font-semibold w-20 hidden md:table-cell">가입</th>
                  </tr>
                </thead>
                <tbody>
                  {tagStats.map((t) => (
                    <tr
                      key={t.slug}
                      className="border-t border-black/10 hover:bg-[#FBF8F1] transition-colors"
                    >
                      <td className="px-2 md:px-3 py-2.5 text-black">
                        {t.name}
                        <span className="text-black/30 text-[10px] md:text-xs ml-1">
                          /{t.slug}
                        </span>
                      </td>
                      <td className="px-2 md:px-3 py-2.5 text-right tabular-nums font-semibold">
                        {t.postCount}
                      </td>
                      <td className="px-2 md:px-3 py-2.5 text-right tabular-nums">
                        {t.avgOpenRate > 0 ? (
                          `${(t.avgOpenRate * 100).toFixed(1)}%`
                        ) : (
                          <span className="text-black/30">—</span>
                        )}
                      </td>
                      <td className="px-2 md:px-3 py-2.5 text-right tabular-nums hidden md:table-cell">
                        {t.totalClicks > 0 ? (
                          t.totalClicks
                        ) : (
                          <span className="text-black/30">—</span>
                        )}
                      </td>
                      <td className="px-2 md:px-3 py-2.5 text-right tabular-nums hidden md:table-cell">
                        {t.totalSignups > 0 ? (
                          t.totalSignups
                        ) : (
                          <span className="text-black/30">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 font-paperlogy text-xs text-black/40">
              평균 오픈율/클릭/가입은 전체 newsletter 발송 글 기준
            </p>
          </section>
        )}

        {/* Ranking 테이블 */}
        <section className="mb-8 md:mb-12">
          <h2 className="font-paperlogy font-semibold text-lg md:text-2xl text-black mb-4">
            글별 ranking (30일 합계)
          </h2>
          {topRaw.length === 0 ? (
            <p className="font-paperlogy text-sm text-black/60 py-8 text-center bg-white border border-black/10 rounded-lg">
              데이터 없음. 글 페이지를 몇 번 방문해야 카운터가 쌓여.
            </p>
          ) : (
            <div className="overflow-x-auto bg-white border border-black/10 rounded-lg">
              <table className="w-full font-paperlogy text-xs md:text-sm">
                <thead className="bg-black text-[#FBF8F1]">
                  <tr>
                    <th className="px-2 md:px-3 py-3 text-left font-semibold w-10">#</th>
                    <th className="px-2 md:px-3 py-3 text-left font-semibold">제목</th>
                    <th className="px-2 md:px-3 py-3 text-right font-semibold w-20">뷰</th>
                    <th className="px-2 md:px-3 py-3 text-right font-semibold w-20 hidden md:table-cell">오픈율</th>
                    <th className="px-2 md:px-3 py-3 text-right font-semibold w-16 hidden md:table-cell">클릭</th>
                    <th className="px-2 md:px-3 py-3 text-right font-semibold w-16 hidden lg:table-cell">가입</th>
                    <th className="px-2 md:px-3 py-3 text-right font-semibold w-16 hidden lg:table-cell">👍</th>
                    <th className="px-2 md:px-3 py-3 text-right font-semibold w-16 hidden lg:table-cell">👎</th>
                  </tr>
                </thead>
                <tbody>
                  {topRaw.map((row, i) => {
                    const p = postMap.get(row.slug);
                    const m = metricsBySlug.get(row.slug);
                    return (
                      <tr
                        key={row.slug}
                        className="border-t border-black/10 hover:bg-[#FBF8F1] transition-colors"
                      >
                        <td className="px-2 md:px-3 py-2.5 font-dm-serif text-black/60">
                          {i + 1}
                        </td>
                        <td className="px-2 md:px-3 py-2.5">
                          <Link
                            href={`/admin/views?token=${encodeURIComponent(token!)}&slug=${encodeURIComponent(row.slug)}`}
                            className="text-black hover:text-[#3F1C03] hover:underline break-keep"
                          >
                            {p?.title ?? row.slug}
                          </Link>
                          <p className="text-black/40 text-[10px] md:hidden mt-0.5">
                            /{row.slug}/
                          </p>
                        </td>
                        <td className="px-2 md:px-3 py-2.5 text-right tabular-nums font-semibold">
                          {row.views.toLocaleString()}
                        </td>
                        <td className="px-2 md:px-3 py-2.5 text-right tabular-nums hidden md:table-cell">
                          {m && m.deliveredCount > 0 ? (
                            <span title={`${m.openedCount}/${m.deliveredCount}`}>
                              {(m.openRate * 100).toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-black/30">—</span>
                          )}
                        </td>
                        <td className="px-2 md:px-3 py-2.5 text-right tabular-nums hidden md:table-cell">
                          {m && m.clicks > 0 ? m.clicks : <span className="text-black/30">—</span>}
                        </td>
                        <td className="px-2 md:px-3 py-2.5 text-right tabular-nums hidden lg:table-cell">
                          {m && m.signups > 0 ? m.signups : <span className="text-black/30">—</span>}
                        </td>
                        <td className="px-2 md:px-3 py-2.5 text-right tabular-nums hidden lg:table-cell">
                          {m && m.positiveFeedback > 0 ? m.positiveFeedback : <span className="text-black/30">—</span>}
                        </td>
                        <td className="px-2 md:px-3 py-2.5 text-right tabular-nums hidden lg:table-cell">
                          {m && m.negativeFeedback > 0 ? m.negativeFeedback : <span className="text-black/30">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* 특정 글 detail */}
        {detail && (
          <section className="mb-8 md:mb-12 bg-white border border-black/10 rounded-lg p-5 md:p-8">
            <div className="flex items-baseline justify-between mb-4 gap-4">
              <div>
                <p className="font-paperlogy text-xs text-black/50 mb-1">
                  /{detail.slug}/
                </p>
                <h3 className="font-paperlogy font-semibold text-lg md:text-2xl text-black break-keep">
                  {detail.post?.title ?? detail.slug}
                </h3>
              </div>
              <Link
                href={`/admin/views?token=${encodeURIComponent(token!)}`}
                className="font-paperlogy text-xs md:text-sm text-black/60 hover:text-black shrink-0"
              >
                ✕ 닫기
              </Link>
            </div>
            <p className="font-paperlogy text-xs md:text-sm text-black/60 mb-3">
              합계{" "}
              <span className="font-semibold text-black">
                {detail.views.reduce((s, d) => s + d.views, 0).toLocaleString()}
              </span>{" "}
              뷰 · 최근 30일
            </p>
            <DailyBarChart
              data={detail.views.map((d) => ({ date: d.date, total: d.views }))}
              max={Math.max(1, ...detail.views.map((d) => d.views))}
            />

            {/* Ghost 이메일 메트릭 (newsletter 발송 글 한정) */}
            {detail.metrics && detail.metrics.deliveredCount > 0 && (
              <div className="mt-6 md:mt-8">
                <h4 className="font-paperlogy text-xs md:text-sm text-black/50 mb-3 uppercase tracking-wider">
                  Ghost 메트릭 (newsletter)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCell
                    label="발송"
                    value={detail.metrics.emailCount}
                  />
                  <MetricCell
                    label="전달"
                    value={detail.metrics.deliveredCount}
                  />
                  <MetricCell
                    label="오픈"
                    value={detail.metrics.openedCount}
                    sub={`${(detail.metrics.openRate * 100).toFixed(1)}%`}
                  />
                  <MetricCell
                    label="클릭"
                    value={detail.metrics.clicks}
                  />
                  <MetricCell
                    label="가입"
                    value={detail.metrics.signups}
                  />
                  <MetricCell
                    label="유료 전환"
                    value={detail.metrics.paidConversions}
                  />
                  <MetricCell
                    label="👍 좋아요"
                    value={detail.metrics.positiveFeedback}
                  />
                  <MetricCell
                    label="👎 별로"
                    value={detail.metrics.negativeFeedback}
                  />
                </div>
              </div>
            )}
            {detail.metrics && detail.metrics.deliveredCount === 0 && (
              <p className="mt-4 font-paperlogy text-xs text-black/40 italic">
                이 글은 newsletter로 발송되지 않음 — Ghost 이메일 메트릭 없음
              </p>
            )}
          </section>
        )}

        <footer className="font-paperlogy text-xs text-black/40 mt-12 text-center">
          ISR off · 매 요청 시 Upstash 직접 조회 · 봇 트래픽 1차 필터 적용
        </footer>
      </div>
    </main>
  );
}

function Card({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-black/10 rounded-lg px-4 md:px-5 py-4 md:py-5">
      <p className="font-paperlogy text-xs md:text-sm text-black/50 mb-1.5">
        {label}
      </p>
      <p className="font-dm-serif text-2xl md:text-4xl text-black tabular-nums">
        {value.toLocaleString()}
      </p>
      {sub && (
        <p className="font-paperlogy text-xs text-black/40 mt-1">{sub}</p>
      )}
    </div>
  );
}

function MetricCell({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub?: string;
}) {
  return (
    <div className="bg-[#FBF8F1] border border-black/10 rounded px-3 py-2.5">
      <p className="font-paperlogy text-[10px] md:text-xs text-black/50">
        {label}
      </p>
      <p className="font-paperlogy font-semibold text-base md:text-lg text-black tabular-nums">
        {value.toLocaleString()}
      </p>
      {sub && (
        <p className="font-paperlogy text-[10px] text-black/40">{sub}</p>
      )}
    </div>
  );
}

function DailyBarChart({
  data,
  max,
}: {
  data: { date: string; total: number }[];
  max: number;
}) {
  if (data.length === 0) {
    return (
      <p className="font-paperlogy text-sm text-black/50 py-6 text-center">
        데이터 없음
      </p>
    );
  }
  return (
    <div className="bg-white border border-black/10 rounded-lg p-4 md:p-5">
      <div className="flex items-end gap-[2px] md:gap-1 h-32 md:h-40">
        {data.map((d) => {
          const h = max > 0 ? (d.total / max) * 100 : 0;
          return (
            <div
              key={d.date}
              className="flex-1 flex flex-col items-center justify-end group relative min-w-0"
              title={`${d.date}: ${d.total}`}
            >
              <div
                className="w-full bg-black rounded-t-sm transition-opacity group-hover:opacity-70"
                style={{ height: `${Math.max(h, d.total > 0 ? 2 : 0)}%` }}
              />
              {/* hover 시 값 표시 */}
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-[#FBF8F1] text-[10px] md:text-xs px-1.5 py-0.5 rounded font-paperlogy whitespace-nowrap z-10">
                {d.total}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 font-paperlogy text-[10px] md:text-xs text-black/40">
        <span>{formatDate(data[0].date)}</span>
        {data.length > 14 && (
          <span>{formatDate(data[Math.floor(data.length / 2)].date)}</span>
        )}
        <span>{formatDate(data[data.length - 1].date)}</span>
      </div>
    </div>
  );
}
