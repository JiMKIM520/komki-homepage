import "server-only";
import GhostContentAPI from "@tryghost/content-api";
import type { GhostPost, GhostTag } from "./ghost-types";

export type { GhostPost, GhostTag };
export { getPreview } from "./ghost-types";

const api = new GhostContentAPI({
  url: process.env.GHOST_URL!,
  key: process.env.GHOST_CONTENT_API_KEY!,
  version: "v5.0",
});

export async function getLatestPosts(limit = 3): Promise<GhostPost[]> {
  try {
    const posts = await api.posts.browse({
      limit,
      include: ["tags", "authors"],
      filter: "visibility:public",
      formats: ["plaintext"],
      fields: [
        "id",
        "title",
        "slug",
        "url",
        "excerpt",
        "plaintext",
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
