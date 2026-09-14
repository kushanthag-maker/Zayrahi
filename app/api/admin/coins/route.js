import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// Admin panel eken username eka haraha coins add karanawa
export async function POST(req) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin witharai" }, { status: 403 });
  try {
    const { username, amount, reason } = await req.json();
    const amt = parseInt(amount, 10);
    if (!username || !amt || isNaN(amt)) {
      return NextResponse.json({ error: "Username saha coin ganithaya denna" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { username: String(username).trim().toLowerCase() } });
    if (!user) return NextResponse.json({ error: "User hambila nathi lada" }, { status: 404 });

    const [updated] = await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { coins: { increment: amt } } }),
      prisma.coinTransaction.create({
        data: {
          userId: user.id,
          amount: amt,
          reason: reason || "Admin top-up",
          byAdmin: admin.username,
        },
      }),
    ]);

    return NextResponse.json({ ok: true, user: { username: updated.username, coins: updated.coins } });
  } catch (e) {
    return NextResponse.json({ error: "Coin add failed" }, { status: 500 });
  }
}

// Users list eka + sahanaya denna
export async function GET() {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admin witharai" }, { status: 403 });
  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true, coins: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ users });
}
