"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPanel() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({ username: "", amount: "", reason: "" });

  function load() {
    fetch("/api/auth/me").then(async (r) => {
      if (r.status === 401) { router.push("/login"); return null; }
      return r.json();
    }).then((d) => {
      if (!d) return;
      if (d.user?.role !== "admin") { router.push("/dashboard"); return; }
      setMe(d.user);
    });
    fetch("/api/admin/coins").then((r) => r.json()).then((d) => setUsers(d.users || []));
  }

  useEffect(load, []);

  async function sendCoins(e) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/admin/coins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setMsg({ ok: false, text: data.error }); return; }
    setMsg({ ok: true, text: `Success! ${data.user.username} ta ${form.amount} coins add wela. New balance: ${data.user.coins}` });
    setForm({ username: "", amount: "", reason: "" });
    load();
  }

  function logout() {
    fetch("/api/auth/logout", { method: "POST" }).then(() => router.push("/login"));
  }

  if (!me) return <div className="container"><p style={{ marginTop: 60 }}>Loading...</p></div>;

  const totalCoins = users.reduce((a, u) => a + u.coins, 0);

  return (
    <div>
      <nav className="top">
        <Link className="logo" href="/">Zayra <span>APIs</span></Link>
        <div className="navlinks">
          <span className="badge">ADMIN</span>
          <Link href="/dashboard">Dashboard</Link>
          <button className="btn danger" onClick={logout}>Log Out</button>
        </div>
      </nav>
      <div className="container">
        <h2 className="sec">⚙️ Admin Panel</h2>

        <div className="stats" style={{ marginTop: 14 }}>
          <div className="stat"><div className="l">Users</div><div className="v">{users.length}</div></div>
          <div className="stat"><div className="l">Total Coins (circulating)</div><div className="v">🪙 {totalCoins}</div></div>
          <div className="stat"><div className="l">Oyage Balance</div><div className="v">🪙 {me.coins}</div></div>
        </div>

        <div className="card">
          <h3>🪙 Coins Send Karanna (username eken)</h3>
          <form onSubmit={sendCoins} className="row" style={{ alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label>Username</label>
              <input list="usernames" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="user eke username eka" required />
              <datalist id="usernames">
                {users.map((u) => <option key={u.id} value={u.username} />)}
              </datalist>
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <label>Coin Ganithaya (+/-)</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="500" required />
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label>Reason (optional)</label>
              <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Payment received" />
            </div>
            <button className="btn primary">Send</button>
          </form>
          {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
        </div>

        <div className="card">
          <h3>👥 Users</h3>
          <table>
            <thead><tr><th>Username</th><th>Role</th><th>Coins</th><th>Joined</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.role === "admin" ? <span className="badge">admin</span> : "user"}</td>
                  <td>🪙 {u.coins}</td>
                  <td><small style={{ color: "var(--muted)" }}>{new Date(u.createdAt).toLocaleDateString()}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
