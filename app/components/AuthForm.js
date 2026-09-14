"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setMsg({ ok: false, text: data.error }); return; }
    if (mode === "login") {
      router.push(data.user?.role === "admin" ? "/admin" : "/dashboard");
    } else {
      setMsg({ ok: true, text: "Account eka hadila! Dana log in karanna." });
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, paddingTop: 80 }}>
      <div className="card">
        <h2 style={{ fontSize: 26 }}>{mode === "login" ? "Log In" : "Sign Up"}</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>
          {mode === "login" ? "Username saha password eken log wenna" : "Username + password ekak thiyagena account ekak hadanna"}
        </p>
        <form onSubmit={submit}>
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="zayra_user" required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          <button className="btn primary" style={{ width: "100%", marginTop: 18 }} disabled={busy}>
            {busy ? "..." : mode === "login" ? "Log In" : "Account Hadanna"}
          </button>
        </form>
        {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
        <div style={{ marginTop: 16, fontSize: 14 }}>
          {mode === "login" ? (
            <>Account ekak nadda? <Link href="/signup">Sign up karanna</Link></>
          ) : (
            <>Already account ekak tiyanawa? <Link href="/login">Log in</Link></>
          )}
        </div>
      </div>
    </div>
  );
}
