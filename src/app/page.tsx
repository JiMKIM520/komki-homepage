import Navbar from "@/components/Navbar";
import HeroArticles from "@/components/HeroArticles";
import LatestArticles from "@/components/LatestArticles";
import RankSection from "@/components/RankSection";
import AdSection from "@/components/AdSection";
import Footer from "@/components/Footer";
import { getLatestPosts } from "@/lib/ghost";

export const revalidate = 60;

export default async function HomePage() {
  // 스페셜 태그(slug=seupesyeol)는 콤키 스페셜 섹션에만 노출 → 일반 흐름에서 제외
  const posts = await getLatestPosts(50, "seupesyeol");

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroArticles posts={posts.slice(0, 3)} />
      <RankSection posts={posts} />
      <LatestArticles posts={posts} />
      <AdSection />
      <Footer />
    </main>
  );
}
