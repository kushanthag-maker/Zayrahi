import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    if (!username || !password || password.length < 4) {
      return NextResponse.json({ error: "Username saha password (min 4) denna" }, { status: 400 });
    }
    const name = String(username).trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(name)) {
      return NextResponse.json({ error: "Username eka letters/numbers/_ witharai (3-20)" }, { status: 400 });
    }
    const exists = await prisma.user.findUnique({ where: { username: name } });
    if (exists) {
      return NextResponse.json({ error: "Username eka already use wela" }, { status: 409 });
    }
    const apiKey = "zayra_" + crypto.randomBytes(24).toString("hex");
    const user = await prisma.user.create({
      data: { username: name, passwordHash: bcrypt.hashSync(password, 10), apiKey },
    });
    return NextResponse.json({ ok: true, user: { id: user.id, username: user.username } });
  } catch (e) {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
