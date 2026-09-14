import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { getService, calcPrice, placeProviderOrder } from "@/lib/services";

export async function POST(req) {
  const s = getSessionUser();
  if (!s) return NextResponse.json({ error: "Login wela nathi lada" }, { status: 401 });
  try {
    const { serviceId, quantity, link } = await req.json();
    const service = getService(serviceId);
    if (!service) return NextResponse.json({ error: "Service eka milila nathi lada" }, { status: 400 });
    const qty = parseInt(quantity, 10);
    if (!qty || qty < service.min || qty > service.max) {
      return NextResponse.json({ error: `Quantity eka ${service.min} - ${service.max} athare denna` }, { status: 400 });
    }
    if (!link) return NextResponse.json({ error: "Link eka denna" }, { status: 400 });

    const price = calcPrice(service, qty);
    const user = await prisma.user.findUnique({ where: { id: s.id } });
    if (!user) return NextResponse.json({ error: "User hambila nathi lada" }, { status: 404 });
    if (user.coins < price) {
      return NextResponse.json({ error: `Coins madi. Meka onanne ${price} coins, oyage tiyanne ${user.coins}` }, { status: 402 });
    }

    // 1. Provider ekata order eka forward karanawa
    const prov = await placeProviderOrder({ service, quantity: qty, link });
    if (!prov.success) return NextResponse.json({ error: prov.error }, { status: 502 });

    // 2. Coins deduct karanawa + order + transaction save karanawa (transactional)
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
        data: { userId: user.id, amount: -price, reason: `Order: ${service.name} x${qty}` },
      }),
    ]);

    return NextResponse.json({ ok: true, order });
  } catch (e) {
    return NextResponse.json({ error: "Order failed" }, { status: 500 });
  }
}

export async function GET() {
  const s = getSessionUser();
  if (!s) return NextResponse.json({ error: "Login wela nathi lada" }, { status: 401 });
  const orders = await prisma.order.findMany({ where: { userId: s.id }, orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json({ orders });
}
