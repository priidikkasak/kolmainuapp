import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "kolmainu_session";

/**
 * Cheap gate only — presence of the cookie, not its validity. The signature is
 * verified in the admin layout and in every admin server action, because proxy
 * may run detached from application code.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasCookie = request.cookies.has(SESSION_COOKIE);

  // Setup instructions must be reachable before any account exists.
  if (pathname === "/admin/seadistus") return NextResponse.next();

  // The login page decides for itself whether an existing session is still
  // valid — bouncing on cookie presence alone would loop on a stale cookie.
  if (pathname === "/admin/login") return NextResponse.next();

  if (!hasCookie) {
    const url = new URL("/admin/login", request.url);
    if (pathname !== "/admin") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
