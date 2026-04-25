import Navbar from "@/components/Navbar";
import HeroArticles from "@/components/HeroArticles";
import LatestArticles from "@/components/LatestArticles";
import RankSection from "@/components/RankSection";
import AdSection from "@/components/AdSection";
import Footer from "@/components/Footer";
import { getLatestPosts } from "@/lib/ghost";

export const revalidate = 3600;

export default async function HomePage() {
  const posts = await getLatestPosts(50);

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
