import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleGrid from "@/components/ArticleGrid";
import TagFilter, { type TagOption } from "@/components/TagFilter";
import { getLatestPosts, getPostsByTag } from "@/lib/ghost";

export const revalidate = 3600;

const TAGS: ReadonlyArray<TagOption> = [
  { label: "모든 콘텐츠", value: "" },
  { label: "AI", value: "ai" },
  { label: "Marketing", value: "marketing" },
  { label: "Trend", value: "trend" },
  { label: "콤키 스페셜", value: "seupesyeol" },
];

export const metadata = {
  title: "콘텐츠 — komki",
  description: "AI · Marketing · Trend · 콤키 스페셜 카테고리별 인사이트",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const params = await searchParams;
  const tag = params.tag ?? "";
  // 모든 콘텐츠 뷰에서는 스페셜 태그(seupesyeol) 제외 — 콤키 스페셜 칩에서만 노출
  const posts = tag
    ? await getPostsByTag(tag, 50)
    : await getLatestPosts(50, "seupesyeol");
  const activeLabel = TAGS.find((t) => t.value === tag)?.label ?? "모든 콘텐츠";

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-6 md:mb-8">
            <span className="inline-flex items-center bg-black text-[#FBF8F1] text-sm md:text-base font-paperlogy font-semibold tracking-wide rounded-full px-5 py-2">
              {activeLabel}
            </span>
          </div>

          <h1 className="font-paperlogy font-semibold text-2xl md:text-4xl text-black mb-6 md:mb-8 leading-tight">
            카테고리별로 콘텐츠를 둘러보세요
          </h1>

          {/* 태그 필터 칩 */}
          <TagFilter tags={TAGS} active={tag} basePath="/articles" />

          {/* 그리드 */}
          <div className="mt-8 md:mt-12">
            <ArticleGrid posts={posts} />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
