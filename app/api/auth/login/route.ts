import { type NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, setAuthCookie } from "@/lib/auth";

const LEADS_DASHBOARD = "/dashboard";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const from = req.nextUrl.searchParams.get("from") ?? LEADS_DASHBOARD;

  if (!verifyAdminPassword(password)) {
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  await setAuthCookie();

  return NextResponse.json({ ok: true, redirectTo: from });
}
