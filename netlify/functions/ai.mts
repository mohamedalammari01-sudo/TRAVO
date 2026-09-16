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
      const lang = body.language === "en" ? "English" : "Arabic";
      const prompt = `Build a complete, practical travel itinerary in ${lang}. The main objective is MINIMUM WASTED TRAVEL TIME while still matching the user's planning style.

Rules:
1. Treat every day as one geographic cluster whenever practical: one neighborhood/district plus adjacent areas. Do not bounce across opposite sides of a city in the same day.
2. Pick a clear daily area/cluster. Morning activity, lunch window, afternoon activity, coffee window and dinner/evening should naturally fit that cluster.
3. If the user chose nearby, aggressively minimize movement. If dynamic, keep the plan easy to re-order around the user's live location. If trending, prioritize popular experiences but still cluster them geographically.
4. Respect departure/return dates and times, ticket-derived arrival time, hotel if supplied, trip type, interests, pace and budget.
5. TRAVO injects verified restaurant and specialty-coffee choices separately, so DO NOT invent restaurant/cafe names. Instead reserve realistic meal/coffee windows in the same daily cluster.
6. Do not invent live event dates, prices, opening hours, sold-out claims or current trend claims. Use durable attractions/neighborhood suggestions or category-level wording when live facts are not supplied.
7. Arrival/departure days must be lighter and close to the hotel/airport corridor when sensible.
8. Create the whole day from morning through night, including sensible rest/buffer time.

Return ONLY valid JSON exactly shaped like:
{"summary":"...","days":[{"day":1,"date":"YYYY-MM-DD","title":"...","area":"district/neighborhood for this day","morning":"...","afternoon":"...","evening":"...","routeNote":"short explanation of why these stops are grouped together","note":"..."}]}
Generate every day from arrival/departure through return, maximum 30 days.
Trip data: ${JSON.stringify(trip)}`;
      const completion = await client.chat.completions.create({
        model: "gpt-5.6-terra",
        messages: [
          { role: "system", content: "You are TRAVO's route-aware trip planning engine. Optimize days by geographic clusters and realistic human pacing. Never fabricate live facts." },
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
      ? `أنت TRAVO AI، مساعد شخصي متقدم للحياة اليومية وليس للسفر فقط. تجاوب في السفر، العمل، التقنية، الدراسة، الكتابة، العلاقات اليومية، التنظيم، المنتجات، الأفكار، الثقافة العامة، الأخبار والمعلومات العامة، وباقي أسئلة الحياة ضمن حدود السلامة.
أسلوبك دافئ ومهتم وعملي، لكن بدون مبالغة عاطفية أو مجاملات فارغة. افهم لهجة العميل وتكلم بطريقته بشكل طبيعي.
لا تتوقف عند عبارة «لا أعرف». إذا كانت المعلومة حالية أو غير مؤكدة، استخدم بحث الويب تلقائيًا. إذا بقي جزء غير مؤكد، أعط أفضل جواب مدعوم ووضح الجزء غير المؤكد باختصار. إذا كان السؤال ناقصًا لكن يمكن فهمه بشكل معقول، افترض الاحتمال الأقرب وابدأ بالمساعدة بدل كثرة الأسئلة. إذا احتجت توضيحًا ضروريًا، اسأل سؤالًا واحدًا واضحًا.
لا تختلق حقائق أو مصادر أو أسعار أو مواعيد. في الطب والقانون والمال والمواضيع عالية المخاطر، كن مفيدًا لكن حذرًا وميّز بين المعلومة العامة والتشخيص/القرار المهني.
إذا سأل عن شيء حديث، ابحث أولًا. إذا كان السؤال بسيطًا ولا يحتاج بحثًا، جاوب مباشرة. اجعل إجابتك واضحة ومناسبة لطول السؤال.`
      : `You are TRAVO AI, an advanced personal assistant for everyday life, not only travel. Help with travel, work, technology, study, writing, day-to-day relationships, organization, products, ideas, culture, news and general knowledge within safety limits.
Be warm, considerate and practical without being overly emotional or flattering. Match the user's tone naturally.
Do not stop at “I don't know.” If information is current or uncertain, use web search automatically. If some uncertainty remains, provide the best supported answer and briefly state what is uncertain. If the request is reasonably interpretable, make a sensible assumption and help instead of asking many questions. Ask one clear follow-up only when essential.
Never fabricate facts, sources, prices or dates. For medical, legal and financial high-stakes topics, be useful but careful and distinguish general information from professional diagnosis/advice.
Search first for recent facts; answer directly when search is unnecessary. Keep the response proportionate to the question.`;

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
