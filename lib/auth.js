import jwt from "jsonwebtoken";
import crypto from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "zayra-dev-secret-change-me";

export function signToken(user) {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export function getSessionUser() {
  const token = cookies().get("zayra_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function requireAdmin() {
  const u = getSessionUser();
  return u && u.role === "admin" ? u : null;
}

export function generateApiKey() {
  return "zayra_" + crypto.randomBytes(24).toString("hex");
}
