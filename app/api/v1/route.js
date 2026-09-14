import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Per-user API key eken yanu kotasa - public reseller API (v1)
// Docs: https://<your-domain>/docs

export async function POST(req) {
  try {
    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const key = body.key || req.headers.get("x-api-key") || url.searchParams.get("key");
    const action = body.action || url.searchParams.get("action");

    if (!key) return NextResponse.json({ error: "API key eka denna" }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { apiKey: key } });
    if (!user) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

    const { SERVICES, getService, calcPrice, placeProviderOrder } = await import("@/lib/services");

    // action=list -> price list
    if (action === "list" || action === "services") {
      return NextResponse.json({
        services: SERVICES.map((s) => ({
          service: s.id,
          name: s.name,
          category: s.category,
          rate_per_1000_lkr: s.ratePer1000Lkr,
          min: s.min,
          max: s.max,
        })),
      });
    }

    // action=status&order_id=x -> order status
    if (action === "status") {
      const orderId = parseInt(body.order || body.order_id, 10);
      if (!orderId) return NextResponse.json({ error: "order_id denna" }, { status: 400 });
      const order = await prisma.order.findFirst({ where: { id: orderId, userId: user.id } });
      if (!order) return NextResponse.json({ error: "Order hambila nathi lada" }, { status: 404 });
      return NextResponse.json({
        order: order.id,
        service: order.serviceName,
        quantity: order.quantity,
        price_lkr: order.priceLkr,
        status: order.status,
        created: order.createdAt,
      });
    }

    // action=add -> new order (coins deduct wenne API eken daapu gamanma)
    if (action === "add") {
      const service = getService(body.service);
      if (!service) return NextResponse.json({ error: "Service eka milila nathi lada" }, { status: 400 });
      const qty = parseInt(body.quantity, 10);
      if (!qty || qty < service.min || qty > service.max) {
        return NextResponse.json({ error: `Quantity eka ${service.min} - ${service.max} athare denna` }, { status: 400 });
      }
      if (!body.link) return NextResponse.json({ error: "link eka denna" }, { status: 400 });
      const price = calcPrice(service, qty);
      if (user.coins < price) {
        return NextResponse.json({ error: "Coins madi", balance: user.coins, required: price }, { status: 402 });
      }
      const prov = await placeProviderOrder({ service, quantity: qty, link: body.link });
      if (!prov.success) return NextResponse.json({ error: prov.error }, { status: 502 });

      const [, order] = await prisma.$transaction([
        prisma.user.update({ where: { id: user.id }, data: { coins: { decrement: price } } }),
        prisma.order.create({
          data: {
            userId: user.id,
            serviceId: service.id,
            serviceName: service.name,
            quantity: qty,
            priceLkr: price,
            providerOrderId: prov.providerOrderId,
          },
        }),
        prisma.coinTransaction.create({
          data: { userId: user.id, amount: -price, reason: `API order: ${service.name} x${qty}` },
        }),
      ]);
      return NextResponse.json({ ok: true, order: order.id, status: order.status, price_lkr: price, balance: user.coins - price });
    }

    // action=balance
    if (action === "balance") {
      return NextResponse.json({ balance: user.coins, currency: "LKR" });
    }

    return NextResponse.json({ error: "action eka: add | list | status | balance" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: "API error" }, { status: 500 });
  }
}

export async function GET(req) {
  // GET requests tath API key + action query string eken
  return POST(req);
}
