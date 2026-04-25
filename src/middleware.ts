import { NextRequest, NextResponse } from "next/server";

// 도메인별 분기:
//   - komki.co.kr (production): MAINTENANCE_MODE=true 일 때 /maintenance 노출
//   - komki.vercel.app, *.vercel.app, localhost: 항상 정상 콘텐츠 (내부 검토용)
const PRODUCTION_HOSTS = new Set(["komki.co.kr", "www.komki.co.kr"]);

export function middleware(request: NextRequest) {
  const isMaintenance = process.env.MAINTENANCE_MODE === "true";
  if (!isMaintenance) return NextResponse.next();

  const host = (request.headers.get("host") || "").toLowerCase();
  // production 도메인이 아니면 maintenance 적용 안 함 (vercel.app preview / 로컬은 정상)
  if (!PRODUCTION_HOSTS.has(host)) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // maintenance 페이지 자체와 정적 자산, API는 통과
  if (
    pathname === "/maintenance" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/fonts") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.(svg|png|jpg|jpeg|webp|gif|ico|woff2|woff|ttf|otf|css|js|map)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/maintenance", request.url));
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
