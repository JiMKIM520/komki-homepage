import GhostContentAPI from "@tryghost/content-api";

const api = new GhostContentAPI({
  url: process.env.GHOST_URL!,
  key: process.env.GHOST_CONTENT_API_KEY!,
  version: "v5.0",
});

export type GhostPost = {
  id: string;
  title: string;
  slug: string;
  url: string;
  excerpt: string | null;
  feature_image: string | null;
  feature_image_alt: string | null;
  published_at: string | null;
  reading_time: number;
  tags: Array<{ id: string; name: string; slug: string }>;
  authors: Array<{ id: string; name: string; slug: string; profile_image: string | null }>;
  visibility: string;
};

export type GhostTag = {
  id: string;
  name: string;
  slug: string;
  count?: { posts: number };
};

export async function getLatestPosts(limit = 3): Promise<GhostPost[]> {
  try {
    const posts = await api.posts.browse({
      limit,
      include: ["tags", "authors"],
      filter: "visibility:public",
      fields: [
        "id",
        "title",
        "slug",
        "url",
        "excerpt",
        "feature_image",
        "feature_image_alt",
        "published_at",
        "reading_time",
        "visibility",
      ],
    });
    return posts as unknown as GhostPost[];
  } catch (error) {
    console.error("Ghost API error:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<GhostPost | null> {
  try {
    const post = await api.posts.read(
      { slug },
      { include: ["tags", "authors"] }
    );
    return post as unknown as GhostPost;
  } catch {
    return null;
  }
}

export async function getAllTags(): Promise<GhostTag[]> {
  try {
    const tags = await api.tags.browse({
      limit: "all",
      include: "count.posts",
    });
    return tags as unknown as GhostTag[];
  } catch (error) {
    console.error("Ghost API tags error:", error);
    return [];
  }
}
