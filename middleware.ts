import { type NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";

const PUBLIC_PATHS = ["/api/auth"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const homePath = pathname === "/";

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p)) || homePath;
  if (isPublic) return NextResponse.next();

  if (!(await getAuthFromRequest(req))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
