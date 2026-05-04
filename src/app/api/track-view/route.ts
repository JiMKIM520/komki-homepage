import { NextRequest, NextResponse } from "next/server";
import { recordView } from "@/lib/post-views";

const BOT_PATTERN = /bot|crawler|spider|preview|lighthouse|headless/i;
const SLUG_PATTERN = /^[a-z0-9-]+$/i;

export async function POST(req: NextRequest) {
  try {
    const ua = req.headers.get("user-agent") ?? "";
    if (BOT_PATTERN.test(ua)) {
      return NextResponse.json({ ok: true, skipped: "bot" });
    }

    const body = await req.json().catch(() => null);
    const slug = typeof body?.slug === "string" ? body.slug : "";
    if (!slug || slug.length > 200 || !SLUG_PATTERN.test(slug)) {
      return NextResponse.json(
        { ok: false, error: "invalid_slug" },
        { status: 400 }
      );
    }

    await recordView(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("track-view route error:", error);
    // 트래킹 실패가 사용자 경험에 영향을 주지 않도록 항상 200
    return NextResponse.json({ ok: true });
  }
}
