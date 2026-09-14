// Zayra APIs - Social Media Service Catalog (LKR price list)
// Provider proxy layer: real orders PROVIDER_API_URL / PROVIDER_API_KEY env
// variables walata configure karapu provider ekata forward wenawa.
// Keys hadcoded nathi bawa secure - okkoma env vars hari.

const PROVIDER_API_URL = process.env.PROVIDER_API_URL || "";
const PROVIDER_API_KEY = process.env.PROVIDER_API_KEY || "";

export const SERVICES = [
  // Facebook
  { id: "fb-page-likes",    name: "Facebook Page Likes",       category: "Facebook",  ratePer1000Lkr: 350, min: 100,   max: 100000, providerServiceId: "1001" },
  { id: "fb-followers",     name: "Facebook Page Followers",   category: "Facebook",  ratePer1000Lkr: 300, min: 100,   max: 50000,  providerServiceId: "1002" },
  { id: "fb-post-likes",    name: "Facebook Post Likes",       category: "Facebook",  ratePer1000Lkr: 250, min: 100,   max: 100000, providerServiceId: "1003" },
  { id: "fb-comments",      name: "Facebook Comments",         category: "Facebook",  ratePer1000Lkr: 900, min: 10,    max: 5000,   providerServiceId: "1004" },
  // Instagram
  { id: "ig-followers",     name: "Instagram Followers",       category: "Instagram", ratePer1000Lkr: 450, min: 100,   max: 100000, providerServiceId: "2001" },
  { id: "ig-likes",         name: "Instagram Likes",           category: "Instagram", ratePer1000Lkr: 200, min: 100,   max: 200000, providerServiceId: "2002" },
  { id: "ig-views",         name: "Instagram Reels Views",     category: "Instagram", ratePer1000Lkr: 80,  min: 500,   max: 1000000, providerServiceId: "2003" },
  { id: "ig-story-views",   name: "Instagram Story Views",     category: "Instagram", ratePer1000Lkr: 120, min: 500,   max: 50000,  providerServiceId: "2004" },
  // TikTok
  { id: "tt-followers",     name: "TikTok Followers",          category: "TikTok",    ratePer1000Lkr: 500, min: 100,   max: 100000, providerServiceId: "3001" },
  { id: "tt-likes",         name: "TikTok Likes",              category: "TikTok",    ratePer1000Lkr: 250, min: 100,   max: 200000, providerServiceId: "3002" },
  { id: "tt-views",         name: "TikTok Video Views",        category: "TikTok",    ratePer1000Lkr: 60,  min: 1000,  max: 5000000, providerServiceId: "3003" },
  // YouTube
  { id: "yt-views",         name: "YouTube Views",             category: "YouTube",   ratePer1000Lkr: 600, min: 500,   max: 500000, providerServiceId: "4001" },
  { id: "yt-subscribers",   name: "YouTube Subscribers",       category: "YouTube",   ratePer1000Lkr: 1500, min: 50,   max: 20000,  providerServiceId: "4002" },
  { id: "yt-likes",         name: "YouTube Likes",             category: "YouTube",   ratePer1000Lkr: 400, min: 100,   max: 50000,  providerServiceId: "4003" },
  { id: "yt-watch-hours",   name: "YouTube Watch Hours",       category: "YouTube",   ratePer1000Lkr: 3000, min: 100,  max: 10000,  providerServiceId: "4004" },
  // X (Twitter)
  { id: "x-followers",      name: "X (Twitter) Followers",     category: "X",         ratePer1000Lkr: 700, min: 100,   max: 50000,  providerServiceId: "5001" },
  { id: "x-likes",          name: "X (Twitter) Likes",         category: "X",         ratePer1000Lkr: 350, min: 100,   max: 50000,  providerServiceId: "5002" },
  { id: "x-retweets",       name: "X (Twitter) Retweets",      category: "X",         ratePer1000Lkr: 400, min: 100,   max: 20000,  providerServiceId: "5003" },
  // Telegram
  { id: "tg-members",       name: "Telegram Channel Members",  category: "Telegram",  ratePer1000Lkr: 550, min: 100,   max: 100000, providerServiceId: "6001" },
  { id: "tg-views",         name: "Telegram Post Views",       category: "Telegram",  ratePer1000Lkr: 70,  min: 500,   max: 500000, providerServiceId: "6002" },
];

export function getService(id) {
  return SERVICES.find((s) => s.id === id) || null;
}

export function calcPrice(service, quantity) {
  return Math.ceil((service.ratePer1000Lkr * quantity) / 1000); // 1 coin = LKR 1
}

// Provider ekata order ekak forward karanawa (proxy layer)
export async function placeProviderOrder({ service, quantity, link }) {
  if (!PROVIDER_API_URL || !PROVIDER_API_KEY) {
    // Demo mode: provider configure kala natham mock order ekak return wenawa
    return { success: true, providerOrderId: "DEMO-" + Date.now(), demo: true };
  }
  try {
    const res = await fetch(PROVIDER_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: PROVIDER_API_KEY,
        action: "add",
        service: service.providerServiceId,
        quantity,
        link,
      }),
    });
    const data = await res.json();
    if (data && data.error) return { success: false, error: data.error };
    return { success: true, providerOrderId: String(data.order || data.id || Date.now()) };
  } catch (e) {
    return { success: false, error: "Provider connection failed" };
  }
}
