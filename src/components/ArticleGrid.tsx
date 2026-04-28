import Image from "next/image";
import Link from "next/link";
import { GhostPost } from "@/lib/ghost-types";

export default function ArticleGrid({ posts }: { posts: GhostPost[] }) {
  if (posts.length === 0) {
    return (
      <p className="font-paperlogy text-base text-[#3F1C03] py-16 text-center">
        해당 콘텐츠가 없습니다.
      </p>
    );
  }

  return (
    <>
      {/* 데스크톱: 3 컬럼 */}
      <div className="hidden md:grid md:grid-cols-3 gap-x-8 gap-y-14">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              {post.feature_image ? (
                <Image
                  src={post.feature_image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-black/30 text-5xl font-black">
                  komki
                </div>
              )}
            </div>
            <h3 className="mt-4 font-paperlogy font-medium text-base md:text-lg leading-snug text-black line-clamp-2 text-left max-w-[80%] break-keep transition-colors group-hover:text-[#3F1C03]">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>

      {/* 모바일: 2행 가로 스크롤 + 검정 제목박스 (고정 높이) */}
      <div className="md:hidden -mx-4 px-4 grid grid-rows-2 grid-flow-col auto-cols-[45%] gap-x-3 gap-y-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="snap-start block"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              {post.feature_image ? (
                <Image
                  src={post.feature_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-black/30 text-5xl font-black">
                  komki
                </div>
              )}
            </div>
            <div className="bg-black px-3 py-3 h-[72px] flex items-start">
              <h3 className="font-paperlogy font-medium text-xs text-[#FBF8F1] leading-snug line-clamp-3 break-keep">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
