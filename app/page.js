"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [services, setServices] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then((d) => setServices(d.services || []));
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user));
  }, []);

  const cats = [...new Set(services.map((s) => s.category))];

  return (
    <div>
      <nav className="top">
        <div className="logo">Zayra <span>APIs</span></div>
        <div className="navlinks">
          <Link href="/#prices">Price List</Link>
          <Link href="/docs">API Docs</Link>
          {user ? (
            <>
              <span className="coin">🪙 {user.coins} coins</span>
              {user.role === "admin" && <Link href="/admin">Admin Panel</Link>}
              <Link className="btn primary" href="/dashboard">Dashboard</Link>
            </>
          ) : (
            <>
              <Link className="btn" href="/login">Log In</Link>
              <Link className="btn primary" href="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <div className="hero">
        <h1>Zayra <em>APIs</em> — Social Media API Hub</h1>
        <p>Sri Lankan price list (LKR) ekak saha coins system ekak saha — Facebook, Instagram, TikTok, YouTube, X, Telegram okkoma ekama thana.</p>
        <div className="row" style={{ justifyContent: "center", marginTop: 22 }}>
          <Link className="btn primary" href="/signup">Free API Key ekak ganna</Link>
          <Link className="btn" href="/docs">Documentation</Link>
        </div>
      </div>

      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
          <div className="stat"><div className="l">🔐 Username + Password</div><div className="v">Multi User</div></div>
          <div className="stat"><div className="l">🪙 Coin Wallet</div><div className="v">LKR 1 = 1 Coin</div></div>
          <div className="stat"><div className="l">🔑 Per-user API Key</div><div className="v">v1 API</div></div>
          <div className="stat"><div className="l">⚙️ Admin Panel</div><div className="v">Coin Send</div></div>
        </div>

        <h2 className="sec" id="prices">💰 Price List (Sri Lanka - LKR)</h2>
        <p style={{ color: "var(--muted)", marginTop: 6 }}>Rate per 1000 units. 1 coin = LKR 1.00</p>
        {cats.map((cat) => (
          <div key={cat} className="card">
            <h3 style={{ marginBottom: 8 }}>{cat}</h3>
            <table>
              <thead>
                <tr><th>Service</th><th>Rate / 1000</th><th>Min</th><th>Max</th><th>Service ID</th></tr>
              </thead>
              <tbody>
                {services.filter((s) => s.category === cat).map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>Rs. {s.ratePer1000Lkr}</td>
                    <td>{s.min}</td>
                    <td>{s.max.toLocaleString()}</td>
                    <td><span className="badge">{s.id}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <footer>Zayra APIs © 2026 — Vercel eke host karanna puluwan</footer>
    </div>
  );
}
