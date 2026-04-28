import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Ghost webhook 또는 수동 호출로 페이지 즉시 재생성.
// 사용 예:
//   POST /api/revalidate?secret=xxx
//   POST /api/revalidate?secret=xxx&path=/articles
//   POST /api/revalidate?secret=xxx (body: { post: { current: { slug: "marketing-6" }}})
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
  }

  // path 쿼리 우선 → Ghost webhook payload의 slug → 기본 경로 일괄
  const paramPath = req.nextUrl.searchParams.get("path");

  let webhookSlug: string | null = null;
  if (req.method === "POST") {
    try {
      const body = await req.json();
      // Ghost webhook 포맷: { post: { current: { slug } } } 또는 { post: { previous: { slug } } }
      const current = body?.post?.current?.slug;
      const previous = body?.post?.previous?.slug;
      if (typeof current === "string" && current.length > 0) webhookSlug = current;
      else if (typeof previous === "string" && previous.length > 0) webhookSlug = previous;
    } catch {
      // body 없으면 무시
    }
  }

  const basePaths = ["/", "/articles", "/search"];
  let paths: string[];
  if (paramPath) {
    paths = [paramPath];
  } else if (webhookSlug) {
    paths = [...basePaths, `/${webhookSlug}`];
  } else {
    paths = basePaths;
  }

  for (const p of paths) {
    revalidatePath(p, "page");
  }

  return NextResponse.json({
    ok: true,
    revalidated: paths,
    now: new Date().toISOString(),
  });
}

// Ghost webhook은 GET을 보낼 수도 있어 GET도 동일 처리 (단, GET은 body 파싱 불가)
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
  }

  const paramPath = req.nextUrl.searchParams.get("path");
  const paths = paramPath ? [paramPath] : ["/", "/articles", "/search"];

  for (const p of paths) {
    revalidatePath(p, "page");
  }

  return NextResponse.json({
    ok: true,
    revalidated: paths,
    now: new Date().toISOString(),
  });
}
