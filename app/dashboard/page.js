"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({ serviceId: "", quantity: "", link: "" });

  function load() {
    fetch("/api/auth/me").then(async (r) => {
      if (r.status === 401) { router.push("/login"); return null; }
      return r.json();
    }).then((d) => d && setUser(d.user));
    fetch("/api/services").then((r) => r.json()).then((d) => setServices(d.services || []));
    fetch("/api/orders").then((r) => r.json()).then((d) => setOrders(d.orders || []));
  }

  useEffect(load, []);

  async function placeOrder(e) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setMsg({ ok: false, text: data.error }); return; }
    setMsg({ ok: true, text: `Order eka success! #${data.order.id} — ${data.order.priceLkr} coins cut wela.` });
    setForm({ serviceId: "", quantity: "", link: "" });
    load();
  }

  function logout() {
    fetch("/api/auth/logout", { method: "POST" }).then(() => router.push("/login"));
  }

  if (!user) return <div className="container"><p style={{ marginTop: 60 }}>Loading...</p></div>;

  const selected = services.find((s) => s.id === form.serviceId);
  const estPrice = selected && form.quantity
    ? Math.ceil((selected.ratePer1000Lkr * parseInt(form.quantity || 0, 10)) / 1000)
    : 0;

  return (
    <div>
      <nav className="top">
        <Link className="logo" href="/">Zayra <span>APIs</span></Link>
        <div className="navlinks">
          <span className="coin">🪙 {user.coins} coins</span>
          {user.role === "admin" && <Link href="/admin">Admin Panel</Link>}
          <Link href="/docs">Docs</Link>
          <button className="btn danger" onClick={logout}>Log Out</button>
        </div>
      </nav>
      <div className="container">
        <h2 className="sec">Dashboard — {user.username}</h2>

        <div className="card">
          <h3>🔑 Oyage API Key</h3>
          <p style={{ color: "var(--muted)", fontSize: 13, margin: "6px 0 10px" }}>
            Meka /api/v1 endpoints walata use karanna (docs balanna)
          </p>
          <div className="keybox">{user.apiKey}</div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="card">
            <h3>🛒 New Order</h3>
            <form onSubmit={placeOrder}>
              <label>Service</label>
              <select value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })} required>
                <option value="">-- Service ekak theraganna --</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} (Rs.{s.ratePer1000Lkr}/1k)</option>
                ))}
              </select>
              <label>Quantity</label>
              <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                min={selected?.min} max={selected?.max} placeholder={selected ? `${selected.min} - ${selected.max}` : "100"} required />
              <label>Link</label>
              <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." required />
              {estPrice > 0 && (
                <p style={{ marginTop: 10 }}>Estimated price: <b>🪙 {estPrice} coins</b> (oyage balance: {user.coins})</p>
              )}
              <button className="btn primary" style={{ marginTop: 14 }} disabled={estPrice > user.coins}>Order Place Karanna</button>
            </form>
            {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
          </div>

          <div className="card">
            <h3>📦 Oyage Orders</h3>
            {orders.length === 0 && <p style={{ color: "var(--muted)" }}>Thama orders nathi lada</p>}
            <table>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id} {o.serviceName}<br /><small style={{ color: "var(--muted)" }}>x{o.quantity} — 🪙{o.priceLkr}</small></td>
                    <td><span className="badge">{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
