import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FRAME_COUNT } from "@/lib/constants";

/**
 * Older builds requested /sequence-1/0001.jpg; assets live at
 * /sequence1/ezgif-frame-001.jpg. Rewrites keep cached bundles working.
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/") {
    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate",
    );
    return response;
  }

  const m = pathname.match(/^\/sequence-1\/(\d+)\.jpg$/i);
  if (!m) return NextResponse.next();

  const num = parseInt(m[1], 10);
  if (num < 1 || num > FRAME_COUNT) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/sequence1/ezgif-frame-${String(num).padStart(3, "0")}.jpg`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/", "/sequence-1/:path*"],
};
