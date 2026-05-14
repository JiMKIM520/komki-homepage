import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopPosts, getDailyTotals, getViewsByDay } from "@/lib/post-views";
import { getPostsBySlugs } from "@/lib/ghost";

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

  const [topRaw, daily30, daily7] = await Promise.all([
    getTopPosts(30, 50),
    getDailyTotals(30),
    getDailyTotals(7),
  ]);

  const slugSet = new Set(topRaw.map((t) => t.slug));
  if (detailSlug) slugSet.add(detailSlug);
  const posts = await getPostsBySlugs(Array.from(slugSet));
  const postMap = new Map(posts.map((p) => [p.slug, p]));

  // 어제 페이지뷰 (오늘 제외 가장 최근 일자)
  const yesterday = daily30.length >= 2 ? daily30[daily30.length - 2] : null;
  const today = daily30.length >= 1 ? daily30[daily30.length - 1] : null;
  const total30 = daily30.reduce((sum, d) => sum + d.total, 0);
  const total7 = daily7.reduce((sum, d) => sum + d.total, 0);
  const avgDaily = daily30.length > 0 ? Math.round(total30 / daily30.length) : 0;

  const maxDaily = Math.max(1, ...daily30.map((d) => d.total));

  const detail = detailSlug
    ? {
        slug: detailSlug,
        post: postMap.get(detailSlug),
        views: await getViewsByDay(detailSlug, 30),
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
            Upstash Redis 일별 zset 기반 · UTC 기준 · 최근 30일
          </p>
        </header>

        {/* 요약 카드 */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-8 md:mb-12">
          <Card label="30일 합계" value={total30} />
          <Card label="7일 합계" value={total7} />
          <Card label="일평균 (30d)" value={avgDaily} />
          <Card
            label="어제"
            value={yesterday?.total ?? 0}
            sub={yesterday ? formatDate(yesterday.date) : ""}
          />
        </section>

        {/* 일별 trend (사이트 전체) */}
        <section className="mb-8 md:mb-12">
          <h2 className="font-paperlogy font-semibold text-lg md:text-2xl text-black mb-4">
            일별 페이지뷰 — 사이트 전체
          </h2>
          <DailyBarChart data={daily30} max={maxDaily} />
          {today && (
            <p className="mt-2 font-paperlogy text-xs text-black/50">
              오늘({formatDate(today.date)})은 진행 중 — {today.total} 뷰
            </p>
          )}
        </section>

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
              <table className="w-full font-paperlogy text-sm md:text-base">
                <thead className="bg-black text-[#FBF8F1]">
                  <tr>
                    <th className="px-3 md:px-4 py-3 text-left font-semibold w-12">
                      #
                    </th>
                    <th className="px-3 md:px-4 py-3 text-left font-semibold">
                      제목
                    </th>
                    <th className="px-3 md:px-4 py-3 text-left font-semibold hidden md:table-cell">
                      slug
                    </th>
                    <th className="px-3 md:px-4 py-3 text-right font-semibold w-24">
                      30일 뷰
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topRaw.map((row, i) => {
                    const p = postMap.get(row.slug);
                    return (
                      <tr
                        key={row.slug}
                        className="border-t border-black/10 hover:bg-[#FBF8F1] transition-colors"
                      >
                        <td className="px-3 md:px-4 py-2.5 font-dm-serif text-black/60">
                          {i + 1}
                        </td>
                        <td className="px-3 md:px-4 py-2.5">
                          <Link
                            href={`/admin/views?token=${encodeURIComponent(token!)}&slug=${encodeURIComponent(row.slug)}`}
                            className="text-black hover:text-[#3F1C03] hover:underline break-keep"
                          >
                            {p?.title ?? row.slug}
                          </Link>
                        </td>
                        <td className="px-3 md:px-4 py-2.5 text-black/50 text-xs md:text-sm hidden md:table-cell">
                          <Link
                            href={`/${row.slug}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            /{row.slug}/
                          </Link>
                        </td>
                        <td className="px-3 md:px-4 py-2.5 text-right tabular-nums font-semibold">
                          {row.views.toLocaleString()}
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
