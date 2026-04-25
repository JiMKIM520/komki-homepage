import { NextRequest, NextResponse } from "next/server";

// MAINTENANCE_MODE=true 환경에서 모든 페이지 요청을 /maintenance로 rewrite.
// dev (.env.local에 미설정 또는 false) 에서는 그대로 동작.
export function middleware(request: NextRequest) {
  const isMaintenance = process.env.MAINTENANCE_MODE === "true";
  if (!isMaintenance) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // maintenance 페이지 자체와 정적 자산, API는 통과
  if (
    pathname === "/maintenance" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/fonts") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/maintenance", request.url));
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
