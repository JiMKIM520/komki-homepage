import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Ghost webhook 또는 수동 호출로 페이지 즉시 재생성.
// 사용 예:
//   POST /api/revalidate?secret=xxx
//   POST /api/revalidate?secret=xxx&path=/articles
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
  }

  // 특정 path만 갱신, 미지정 시 주요 페이지 일괄 갱신
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

// Ghost webhook은 GET을 보낼 수도 있어 GET도 동일 처리
export const GET = POST;
