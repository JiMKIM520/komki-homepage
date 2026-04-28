import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPostBySlug, getLatestPosts, getPostsByTag } from "@/lib/ghost";
import type { GhostPost } from "@/lib/ghost-types";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return "";
  }
}

function badgeLabel(tagName: string): string {
  const lc = tagName.toLowerCase();
  if (lc.includes("ai")) return "AI";
  if (lc.includes("market") || tagName.includes("마케팅")) return "Marketing";
  if (lc.includes("trend") || tagName.includes("트렌드")) return "Trend";
  if (tagName.includes("스페셜")) return "콤키 스페셜";
  return tagName;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "콘텐츠를 찾을 수 없습니다 — komki" };

  const description = post.excerpt ?? post.plaintext?.slice(0, 160) ?? "";
  return {
    title: `${post.title} — komki`,
    description,
    openGraph: {
      title: post.title,
      description,
      images: post.feature_image ? [{ url: post.feature_image }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.feature_image ? [post.feature_image] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const primaryTagSlug = post.tags?.[0]?.slug;
  const candidates: GhostPost[] = primaryTagSlug
    ? await getPostsByTag(primaryTagSlug, 6)
    : await getLatestPosts(6, "seupesyeol");
  const related = candidates.filter((p) => p.id !== post.id).slice(0, 3);

  const tag = post.tags?.[0];
  const author = post.authors?.[0];
  const dateStr = formatDate(post.published_at);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <article className="bg-white">
        <header className="max-w-3xl mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-6 md:pb-8">
          {tag && (
            <div className="mb-5 md:mb-6">
              <Link
                href={
                  tag.slug === "seupesyeol"
                    ? "/articles?tag=seupesyeol"
                    : `/articles?tag=${tag.slug}`
                }
                className="inline-flex items-center bg-black text-[#FBF8F1] text-xs md:text-sm font-paperlogy font-semibold tracking-wide rounded-full px-4 py-1.5"
              >
                {badgeLabel(tag.name)}
              </Link>
            </div>
          )}

          <h1 className="font-paperlogy font-semibold text-2xl md:text-4xl leading-tight text-black mb-5 md:mb-6 break-keep">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 font-paperlogy text-xs md:text-sm text-black/60">
            {author?.name && <span>{author.name}</span>}
            {author?.name && (dateStr || post.reading_time) && (
              <span className="text-black/30">·</span>
            )}
            {dateStr && <span>{dateStr}</span>}
            {dateStr && post.reading_time > 0 && (
              <span className="text-black/30">·</span>
            )}
            {post.reading_time > 0 && <span>{post.reading_time}분 읽기</span>}
          </div>
        </header>

        {post.feature_image && (
          <div className="max-w-4xl mx-auto px-4 md:px-8 mb-8 md:mb-12">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <Image
                src={post.feature_image}
                alt={post.feature_image_alt || post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 md:px-8 pb-14 md:pb-20">
          {/* Ghost Content API HTML — 단일 신뢰 작성자가 운영하는 헤드리스 CMS 컨텐츠.
              Ghost는 자체적으로 본문을 sanitize하며, 인증된 작성자만 글을 발행할 수 있어
              여기서는 dangerouslySetInnerHTML 사용이 정당화됨. */}
          <div
            className="komki-prose"
            dangerouslySetInnerHTML={{ __html: post.html ?? "" }}
          />
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-[#FBF8F1] py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-6 md:mb-8">
              <span className="inline-flex items-center bg-black text-[#FBF8F1] text-sm md:text-base font-paperlogy font-semibold tracking-wide rounded-full px-5 py-2">
                더 읽어보기
              </span>
            </div>

            <div className="hidden md:grid md:grid-cols-3 gap-x-8 gap-y-12">
              {related.map((p) => (
                <RelatedCard key={p.id} post={p} />
              ))}
            </div>
            <div className="md:hidden -mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
              {related.map((p) => (
                <RelatedCard key={p.id} post={p} mobile />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

function RelatedCard({ post, mobile = false }: { post: GhostPost; mobile?: boolean }) {
  const widthClass = mobile ? "snap-start shrink-0 w-[70%]" : "w-full";
  return (
    <Link href={`/${post.slug}/`} className={`group block ${widthClass}`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#3F1C03]/5">
        {post.feature_image ? (
          <Image
            src={post.feature_image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 70vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-black/30 text-4xl font-black">
            komki
          </div>
        )}
      </div>
      <h3 className="mt-3 md:mt-4 font-paperlogy font-medium text-sm md:text-base leading-snug text-black line-clamp-2 break-keep transition-colors group-hover:text-[#3F1C03]">
        {post.title}
      </h3>
    </Link>
  );
}
