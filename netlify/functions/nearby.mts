import type { Config, Context } from "@netlify/functions";

type NearbyBody = { lat?: number; lng?: number; query?: string; language?: "ar" | "en"; radius?: number };

function kmBetween(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const toRad = (v: number) => v * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function googleSearch(lat: number, lng: number, query: string, language: "ar" | "en", radius: number, apiKey: string) {
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.primaryTypeDisplayName,places.priceLevel"
    },
    body: JSON.stringify({
      textQuery: query,
      pageSize: 15,
      languageCode: language,
      locationBias: { circle: { center: { latitude: lat, longitude: lng }, radius } }
    })
  });
  if (!response.ok) throw new Error(`GOOGLE_PLACES_${response.status}`);
  const data: any = await response.json();
  return (data.places || []).map((p: any) => {
    const pLat = Number(p.location?.latitude), pLng = Number(p.location?.longitude);
    return {
      id: p.id,
      name: p.displayName?.text || "",
      address: p.formattedAddress || "",
      type: p.primaryTypeDisplayName?.text || "",
      lat: pLat,
      lng: pLng,
      distanceKm: Number.isFinite(pLat) && Number.isFinite(pLng) ? kmBetween(lat, lng, pLat, pLng) : null,
      rating: typeof p.rating === "number" ? p.rating : null,
      reviews: typeof p.userRatingCount === "number" ? p.userRatingCount : null,
      openNow: typeof p.currentOpeningHours?.openNow === "boolean" ? p.currentOpeningHours.openNow : null,
      priceLevel: p.priceLevel || null
    };
  }).filter((p: any) => p.name).sort((a: any, b: any) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999)).slice(0, 5);
}

async function osmFallback(lat: number, lng: number, query: string, language: "ar" | "en") {
  const latDelta = 0.06, lngDelta = 0.07;
  const viewbox = `${lng - lngDelta},${lat + latDelta},${lng + lngDelta},${lat - latDelta}`;
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "12");
  url.searchParams.set("bounded", "1");
  url.searchParams.set("viewbox", viewbox);
  url.searchParams.set("accept-language", language);
  const response = await fetch(url, { headers: { "User-Agent": "TRAVO-Nearby/1.0 https://travo-app-e76c.netlify.app" } });
  if (!response.ok) throw new Error(`OSM_${response.status}`);
  const data: any[] = await response.json();
  return data.map((p: any) => {
    const pLat = Number(p.lat), pLng = Number(p.lon);
    return {
      id: `osm-${p.place_id}`,
      name: p.name || String(p.display_name || "").split(",")[0],
      address: p.display_name || "",
      type: p.type || p.category || "",
      lat: pLat,
      lng: pLng,
      distanceKm: kmBetween(lat, lng, pLat, pLng),
      rating: null,
      reviews: null,
      openNow: null,
      priceLevel: null
    };
  }).filter((p) => p.name).sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 5);
}

export default async (req: Request, _context: Context) => {
  if (req.method === "GET") {
    return Response.json({ ready: true, ratingsReady: Boolean(Netlify.env.get("GOOGLE_MAPS_API_KEY")) });
  }
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const body = (await req.json()) as NearbyBody;
    const lat = Number(body.lat), lng = Number(body.lng), query = String(body.query || "").trim();
    const language = body.language === "en" ? "en" : "ar";
    const radius = Math.max(500, Math.min(15000, Number(body.radius) || 5000));
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !query) return Response.json({ error: "INVALID_SEARCH" }, { status: 400 });
    const key = Netlify.env.get("GOOGLE_MAPS_API_KEY");
    if (key) {
      const places = await googleSearch(lat, lng, query, language, radius, key);
      return Response.json({ places, provider: "Google Places", ratingsAvailable: true });
    }
    const places = await osmFallback(lat, lng, query, language);
    return Response.json({ places, provider: "OpenStreetMap", ratingsAvailable: false, setupHint: "Add GOOGLE_MAPS_API_KEY to enable ratings, review counts, open-now and richer place data." });
  } catch (error) {
    console.error("TRAVO nearby error", error);
    return Response.json({ error: "NEARBY_UNAVAILABLE" }, { status: 503 });
  }
};

export const config: Config = { path: "/api/nearby" };
