import Navbar from "@/components/Navbar";
import HeroArticles from "@/components/HeroArticles";
import LatestArticles from "@/components/LatestArticles";
import RankSection from "@/components/RankSection";
import AdSection from "@/components/AdSection";
import InfoSection from "@/components/InfoSection";
import Footer from "@/components/Footer";
import { getLatestPosts, getPostsBySlugs } from "@/lib/ghost";
import { getTopPosts } from "@/lib/post-views";

export const revalidate = 60;

export default async function HomePage() {
  // 콤키 스페셜(seupesyeol) + 한입 정보(info)는 각자 별도 섹션에만 노출 → 일반 흐름 제외
  const [posts, top] = await Promise.all([
    getLatestPosts(50, ["seupesyeol", "info"]),
    getTopPosts(30, 5),
  ]);

  // RankSection: 30일 페이지뷰 기반. 데이터 부족하면 최신순으로 폴백.
  let ranked = await getPostsBySlugs(
    top.map((t) => t.slug),
    ["seupesyeol", "info"]
  );
  if (ranked.length < 5) {
    const seen = new Set(ranked.map((p) => p.id));
    for (const p of posts) {
      if (ranked.length >= 5) break;
      if (!seen.has(p.id)) ranked.push(p);
    }
  }
  ranked = ranked.slice(0, 5);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroArticles posts={posts.slice(0, 3)} />
      <RankSection posts={ranked} />
      <LatestArticles posts={posts} />
      <AdSection />
      <InfoSection />
      <Footer />
    </main>
  );
}
