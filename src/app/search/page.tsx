import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleGrid from "@/components/ArticleGrid";
import { searchPosts } from "@/lib/ghost";

export const revalidate = 0; // 검색은 동적

export const metadata = {
  title: "검색 — komki",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const posts = q ? await searchPosts(q, 50) : [];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-6 md:mb-8">
            <span className="inline-flex items-center bg-black text-[#FBF8F1] text-sm md:text-base font-paperlogy font-semibold tracking-wide rounded-full px-5 py-2">
              검색 결과
            </span>
          </div>

          {q ? (
            <>
              <h1 className="font-paperlogy font-semibold text-2xl md:text-4xl text-black leading-tight">
                <span className="font-dm-serif">&ldquo;{q}&rdquo;</span>
                <span className="ml-2">에 대한 결과</span>
                <span className="ml-3 text-[#3F1C03] text-base md:text-xl">
                  ({posts.length})
                </span>
              </h1>
              <div className="mt-8 md:mt-12">
                <ArticleGrid posts={posts} />
              </div>
            </>
          ) : (
            <p className="font-paperlogy text-base md:text-lg text-[#3F1C03]">
              상단 검색창에 키워드를 입력해 주세요.
            </p>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
