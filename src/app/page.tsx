import Navbar from "@/components/Navbar";
import HeroArticles from "@/components/HeroArticles";
import LatestArticles from "@/components/LatestArticles";
import RankSection from "@/components/RankSection";
import AdSection from "@/components/AdSection";
import InfoSection from "@/components/InfoSection";
import Footer from "@/components/Footer";
import { getLatestPosts } from "@/lib/ghost";

export const revalidate = 60;

export default async function HomePage() {
  // 콤키 스페셜(seupesyeol) + 한입 정보(info)는 각자 별도 섹션에만 노출 → 일반 흐름 제외
  const posts = await getLatestPosts(50, ["seupesyeol", "info"]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroArticles posts={posts.slice(0, 3)} />
      <RankSection posts={posts} />
      <LatestArticles posts={posts} />
      <AdSection />
      <InfoSection />
      <Footer />
    </main>
  );
}
