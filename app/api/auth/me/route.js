import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const s = getSessionUser();
  if (!s) return NextResponse.json({ user: null }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: s.id } });
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({
    user: { id: user.id, username: user.username, role: user.role, coins: user.coins, apiKey: user.apiKey },
  });
}
