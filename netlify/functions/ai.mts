import type { Config, Context } from "@netlify/functions";
import OpenAI from "openai";

type TripData = {
  origin?: string; destination?: string; departureDate?: string; departureTime?: string;
  arrivalDate?: string; arrivalTime?: string; returnDate?: string; flightNumber?: string;
  hotel?: string; checkIn?: string; checkOut?: string; tripType?: string; interests?: string[];
  pace?: string; budget?: string; planStyle?: string;
};
type Body = {
  action?: "chat" | "scanTicket" | "generateTrip";
  message?: string; language?: "ar" | "en"; city?: string; tripContext?: string;
  imageDataUrl?: string; trip?: TripData;
};

function extractJson(text: string) {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(cleaned);
}

export default async (req: Request, _context: Context) => {
  if (req.method === "GET") {
    const gateway = Netlify.env.get("OPENAI_BASE_URL");
    return Response.json({ ready: Boolean(gateway), provider: gateway ? "Netlify AI Gateway" : null });
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
        model: "gpt-4o-mini",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: `Read this flight ticket or boarding pass image. Extract only information that is visibly supported. ${languageInstruction} Return ONLY valid JSON with these keys: origin, destination, destinationCity, departureDate, departureTime, arrivalDate, arrivalTime, returnDate, flightNumber, airline. Dates must be YYYY-MM-DD when present, times HH:MM when present. Use empty strings for unknown values. Never guess.` },
            { type: "image_url", image_url: { url: body.imageDataUrl, detail: "high" } }
          ] as any
        }],
        max_completion_tokens: 900
      });
      const text = completion.choices[0]?.message?.content || "{}";
      return Response.json({ ticket: extractJson(text), model: "gpt-4o-mini" });
    }

    if (body.action === "generateTrip") {
      const trip = body.trip || {};
      if (!trip.destination) return Response.json({ error: "DESTINATION_REQUIRED" }, { status: 400 });
      const lang = body.language === "en" ? "English" : "Arabic";
      const prompt = `Create a practical full travel itinerary in ${lang} from the supplied trip data. Respect arrival/departure times, trip type, interests, pace, budget and planning style. Do not invent live event dates, prices, opening hours, sold-out status, or currently trending claims. If exact current places are not verified in the supplied data, use useful category-level suggestions such as 'local breakfast near the hotel' rather than fabricating a named venue. On arrival and departure days keep the plan realistic. Return ONLY valid JSON: {"summary":"...","days":[{"day":1,"date":"YYYY-MM-DD","title":"...","morning":"...","afternoon":"...","evening":"...","note":"..."}]}. Generate every day from arrival/departure through return/check-out, maximum 30 days. Trip data: ${JSON.stringify(trip)}`;
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are TRAVO AI, a careful travel planning engine. Produce realistic itineraries and distinguish planning suggestions from live verified facts." },
          { role: "user", content: prompt }
        ],
        max_completion_tokens: 3500
      });
      const text = completion.choices[0]?.message?.content || "{}";
      return Response.json({ itinerary: extractJson(text), model: "gpt-4o-mini" });
    }

    const message = body.message?.trim();
    if (!message) return Response.json({ error: "Message is required" }, { status: 400 });
    const system = body.language === "en"
      ? "You are TRAVO AI, a practical travel assistant. Help with trip planning, neighborhoods, transport, dining and experiences. Clearly distinguish general guidance from live information. Never claim a live trend, opening status, date or price is verified unless it is provided in TRAVO context."
      : "أنت TRAVO AI، مساعد سفر عملي ومختصر. ساعد المستخدم في تخطيط الرحلات، اختيار المناطق، ترتيب اليوم، النقل، المطاعم والتجارب. ميّز بوضوح بين المعلومات العامة والمعلومات الحية. لا تدّعِ أن معلومة آنية أو ترند أو موعد أو سعر تم التحقق منه إلا إذا جاء ضمن سياق TRAVO المرسل لك.";
    const context = [body.city ? `Selected city: ${body.city}` : "", body.tripContext ? `TRAVO context: ${body.tripContext}` : ""].filter(Boolean).join("\n");
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        ...(context ? [{ role: "system" as const, content: context }] : []),
        { role: "user", content: message }
      ],
      max_completion_tokens: 700
    });
    return Response.json({ answer: completion.choices[0]?.message?.content || "No response", model: "gpt-4o-mini" });
  } catch (error) {
    console.error("TRAVO AI error", error);
    return Response.json({ error: "AI_UNAVAILABLE", message: "TRAVO AI is not available yet." }, { status: 503 });
  }
};

export const config: Config = { path: "/api/ai" };
