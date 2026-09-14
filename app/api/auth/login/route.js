import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username saha password denna" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { username: String(username).trim().toLowerCase() } });
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return NextResponse.json({ error: "Username ho password validadu" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true, user: { id: user.id, username: user.username, role: user.role } });
    res.cookies.set("zayra_token", signToken(user), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
