import type { Config, Context } from "@netlify/functions";
import OpenAI from "openai";

type HistoryItem = { role: "user" | "assistant"; content: string };
type TripData = {
  origin?: string; originCode?: string; destination?: string; destinationCode?: string; destinationKey?: string;
  departureDate?: string; departureTime?: string; arrivalDate?: string; arrivalTime?: string;
  returnDate?: string; returnTime?: string; flightNumber?: string; hotel?: string;
  tripType?: string; interests?: string[]; pace?: string; budget?: string; planStyle?: string;
};
type Body = {
  action?: "chat" | "scanTicket" | "generateTrip";
  message?: string; language?: "ar" | "en"; city?: string; tripContext?: string;
  imageDataUrl?: string; trip?: TripData; history?: HistoryItem[];
};

function extractJson(text: string) {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(cleaned);
}

function safeHistory(items?: HistoryItem[]) {
  return (Array.isArray(items) ? items : [])
    .filter((x) => x && (x.role === "user" || x.role === "assistant") && typeof x.content === "string")
    .slice(-16)
    .map((x) => ({ role: x.role, content: x.content.slice(0, 5000) }));
}

const saudiDestinationTerms = [
  "الرياض", "riyadh", "جدة", "jeddah", "العلا", "alula", "al ula", "الطائف", "taif", "أبها", "abha",
  "الخبر", "khobar", "dammam", "الدمام", "الدرعية", "diriyah", "حائل", "hail", "تبوك", "tabuk", "أملج", "umluj"
];

function isSaudiDestination(value?: string) {
  const normalized = String(value || "").trim().toLowerCase();
  return saudiDestinationTerms.some((term) => normalized.includes(term));
}

function collectSources(value: unknown) {
  const found = new Map<string, { title?: string; url: string }>();
  const visit = (node: any) => {
    if (!node || typeof node !== "object") return;
    if (typeof node.url === "string" && /^https?:\/\//.test(node.url)) {
      found.set(node.url, { title: typeof node.title === "string" ? node.title : undefined, url: node.url });
    }
    if (Array.isArray(node)) node.forEach(visit);
    else Object.values(node).forEach(visit);
  };
  visit(value);
  return [...found.values()].slice(0, 6);
}

export default async (req: Request, _context: Context) => {
  if (req.method === "GET") {
    const gateway = Netlify.env.get("OPENAI_BASE_URL");
    return Response.json({ ready: Boolean(gateway), provider: gateway ? "Netlify AI Gateway" : null, model: "gpt-5.6-sol", webSearch: true });
  }
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const body = (await req.json()) as Body;
    const client = new OpenAI();

    if (body.action === "scanTicket") {
      if (!body.imageDataUrl?.startsWith("data:image/")) {
        return Response.json({ error: "IMAGE_REQUIRED" }, { status: 400 });
      }
      const languageInstruction = body.language === "en" ? "Use English city names when known." : "Use Arabic city names when clearly known, otherwise keep airport codes.";
      const completion = await client.chat.completions.create({
        model: "gpt-5.6-luna",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: `Read this flight ticket, itinerary, e-ticket, or boarding pass image. Extract only information visibly supported by the image. ${languageInstruction} If the image contains outbound and return flight segments, use the outbound departure for departureDate/departureTime and the inbound departure for returnDate/returnTime. Return ONLY valid JSON with these keys: origin, destination, destinationCity, departureDate, departureTime, arrivalDate, arrivalTime, returnDate, returnTime, flightNumber, airline. Dates must be YYYY-MM-DD when present and times HH:MM when present. Use empty strings for unknown values. Never guess.` },
            { type: "image_url", image_url: { url: body.imageDataUrl, detail: "high" } }
          ] as any
        }],
        max_completion_tokens: 1000
      });
      const text = completion.choices[0]?.message?.content || "{}";
      return Response.json({ ticket: extractJson(text), model: "gpt-5.6-luna" });
    }

    if (body.action === "generateTrip") {
      const trip = body.trip || {};
      if (!trip.destination) return Response.json({ error: "DESTINATION_REQUIRED" }, { status: 400 });
      if (!isSaudiDestination(trip.destination)) {
        return Response.json({ error: "SAUDI_DESTINATION_REQUIRED", message: "Choose a Saudi domestic destination." }, { status: 400 });
      }
      const lang = body.language === "en" ? "English" : "Arabic";
      const prompt = `Build a complete, practical DOMESTIC SAUDI ARABIA itinerary in ${lang}. The main objective is MINIMUM WASTED TRAVEL TIME while still matching the user's planning style.

Rules:
1. Treat every day as one geographic cluster whenever practical: one neighborhood/district plus adjacent areas. Do not bounce across opposite sides of a city in the same day.
2. Pick a clear daily area/cluster. Morning activity, lunch window, afternoon activity, coffee window and dinner/evening should naturally fit that cluster.
3. If the user chose nearby, aggressively minimize movement. If dynamic, keep the plan easy to re-order around the user's live location. If trending, prioritize popular experiences but still cluster them geographically.
4. Respect departure/return dates and times, ticket-derived arrival time, hotel if supplied, trip type, interests, pace and budget.
5. TRAVO injects verified restaurant and specialty-coffee choices separately, so DO NOT invent restaurant/cafe names. Instead reserve realistic meal/coffee windows in the same daily cluster.
6. Keep every recommendation inside Saudi Arabia. Do not invent live event dates, prices, opening hours, sold-out claims or current trend claims. Use durable Saudi attractions, neighborhoods or category-level wording when live facts are not supplied.
7. Arrival/departure days must be lighter and close to the hotel/airport corridor when sensible.
8. Create the whole day from morning through night, including sensible rest/buffer time.

Return ONLY valid JSON exactly shaped like:
{"summary":"...","days":[{"day":1,"date":"YYYY-MM-DD","title":"...","area":"district/neighborhood for this day","morning":"...","afternoon":"...","evening":"...","routeNote":"short explanation of why these stops are grouped together","note":"..."}]}
Generate every day from arrival/departure through return, maximum 30 days.
Trip data: ${JSON.stringify(trip)}`;
      const completion = await client.chat.completions.create({
        model: "gpt-5.6-terra",
        messages: [
          { role: "system", content: "You are TRAVO's route-aware domestic Saudi Arabia trip planning engine. Optimise days by geographic clusters and realistic human pacing. Never fabricate live facts." },
          { role: "user", content: prompt }
        ],
        max_completion_tokens: 5000
      });
      const text = completion.choices[0]?.message?.content || "{}";
      return Response.json({ itinerary: extractJson(text), model: "gpt-5.6-terra" });
    }

    const message = body.message?.trim();
    if (!message) return Response.json({ error: "Message is required" }, { status: 400 });
    const history = safeHistory(body.history);
    const isArabic = body.language !== "en";
    const instructions = isArabic
      ? `أنت TRAVO AI، مساعد متخصص حصريًا في السياحة الداخلية داخل المملكة العربية السعودية.
ساعد الزائر في اختيار الوجهات السعودية، الفعاليات والمواسم، الأنشطة والتجارب، المواقع والمعالم، المسارات، توقيت الزيارة، والتنقل داخل المملكة.
إذا كان السؤال خارج السياحة الداخلية السعودية، وضّح بلطف أن TRAVO مخصص حاليًا للسياحة السعودية ثم اقترح سؤالًا مناسبًا عن وجهة أو تجربة داخل المملكة.
افهم لهجة العميل وتكلم بطريقة دافئة وعملية. عند الحاجة إلى معلومة حديثة مثل فعالية أو توقيت أو سعر أو ساعات تشغيل، ابحث أولًا واذكر المصادر المتاحة. لا تخترع حقائق أو مصادر أو أسعار أو مواعيد. اجعل الإجابة واضحة ومختصرة ومفيدة.`
      : `You are TRAVO AI, an assistant dedicated exclusively to domestic tourism within Saudi Arabia.
Help visitors choose Saudi destinations, events and seasons, activities and experiences, landmarks, routes, visit timing and travel within the Kingdom.
If a request falls outside domestic Saudi tourism, politely explain that TRAVO currently focuses on Saudi tourism and suggest a relevant Saudi destination or experience question.
Be warm and practical. For current information such as events, schedules, prices or opening hours, search first and share available sources. Never invent facts, sources, prices or dates. Keep answers clear, concise and useful.`;

    const context = [
      body.city ? `Current city/destination context: ${body.city}` : "",
      body.tripContext ? `TRAVO trip context: ${body.tripContext}` : ""
    ].filter(Boolean).join("\n");
    const transcript = history.map((x) => `${x.role === "user" ? "USER" : "ASSISTANT"}: ${x.content}`).join("\n\n");
    const input = `${context ? context + "\n\n" : ""}${transcript ? transcript + "\n\n" : ""}USER: ${message}`;

    try {
      const response = await client.responses.create({
        model: "gpt-5.6-sol",
        instructions,
        input,
        tools: [{ type: "web_search_preview" } as any],
        tool_choice: "auto",
        include: ["web_search_call.action.sources" as any],
        max_output_tokens: 2200
      });
      const answer = response.output_text?.trim();
      if (!answer) throw new Error("EMPTY_RESPONSE");
      return Response.json({ answer, model: "gpt-5.6-sol", webSearch: true, sources: collectSources(response.output) });
    } catch (webError) {
      console.warn("TRAVO web-enabled response fallback", webError);
      const completion = await client.chat.completions.create({
        model: "gpt-5.6-terra",
        messages: [
          { role: "system", content: instructions },
          ...(context ? [{ role: "system" as const, content: context }] : []),
          ...history,
          { role: "user", content: message }
        ],
        max_completion_tokens: 1800
      });
      return Response.json({ answer: completion.choices[0]?.message?.content || (isArabic ? "خلني أساعدك بأقرب حل عملي ممكن." : "Let me give you the closest practical answer I can."), model: "gpt-5.6-terra", webSearch: false, sources: [] });
    }
  } catch (error) {
    console.error("TRAVO AI error", error);
    return Response.json({ error: "AI_UNAVAILABLE", message: "TRAVO AI is temporarily unavailable." }, { status: 503 });
  }
};

export const config: Config = { path: "/api/ai" };
