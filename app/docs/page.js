import Link from "next/link";

export const metadata = { title: "API Docs - Zayra APIs" };

export default function Docs() {
  return (
    <div>
      <nav className="top">
        <Link className="logo" href="/">Zayra <span>APIs</span></Link>
        <div className="navlinks">
          <Link href="/#prices">Price List</Link>
          <Link className="btn primary" href="/signup">Sign Up</Link>
        </div>
      </nav>
      <div className="container">
        <h2 className="sec">📚 Zayra APIs — Documentation</h2>
        <p style={{ color: "var(--muted)", marginTop: 8 }}>
          Base URL: <code>https://your-domain.vercel.app/api/v1</code> — Sign up karala dashboard eken API key ekak ganna.
        </p>

        <div className="card">
          <h3>1. Price List ganna</h3>
          <pre className="code">{`POST /api/v1
x-api-key: zayra_xxxxx
{"action": "list"}`}</pre>
        </div>

        <div className="card">
          <h3>2. Balance check karanna</h3>
          <pre className="code">{`POST /api/v1
x-api-key: zayra_xxxxx
{"action": "balance"}

// Response: {"balance": 5000, "currency": "LKR"}`}</pre>
        </div>

        <div className="card">
          <h3>3. Order ekak daanna</h3>
          <pre className="code">{`POST /api/v1
x-api-key: zayra_xxxxx
{"action": "add", "service": "ig-followers", "quantity": 1000, "link": "https://instagram.com/username"}

// Response: {"ok": true, "order": 12, "price_lkr": 450, "balance": 4550}`}</pre>
        </div>

        <div className="card">
          <h3>4. Order status eka</h3>
          <pre className="code">{`POST /api/v1
x-api-key: zayra_xxxxx
{"action": "status", "order_id": 12}`}</pre>
        </div>

        <div className="card">
          <h3>Coins system</h3>
          <p>1 coin = LKR 1.00. Admin panel eken coins add karanna puluwan. Order ekak dapu gaman price eka coins walin cut wenawa.</p>
        </div>
      </div>
      <footer>Zayra APIs © 2026</footer>
    </div>
  );
}
