import type { Config, Context } from "@netlify/functions";
import OpenAI from "openai";

type ChatBody = { message?: string; language?: "ar" | "en"; city?: string; tripContext?: string };

const SYSTEM_AR = `أنت TRAVO AI، مساعد سفر عملي ومختصر. ساعد المستخدم في تخطيط الرحلات، اختيار المناطق، ترتيب اليوم، النقل، المطاعم والتجارب. ميّز بوضوح بين المعلومات العامة والمعلومات الحية. لا تدّعِ أن معلومة آنية أو ترند أو موعد أو سعر تم التحقق منه إلا إذا جاء ضمن سياق TRAVO المرسل لك. إذا احتاج السؤال بيانات حية غير متاحة، قل بوضوح إن TRAVO يحتاج تحديث البيانات الحية قبل تأكيدها.`;
const SYSTEM_EN = `You are TRAVO AI, a practical travel assistant. Help with trip planning, neighborhoods, transport, dining and experiences. Clearly distinguish general guidance from live information. Never claim a live trend, opening status, date or price is verified unless it is provided in TRAVO context.`;

export default async (req: Request, _context: Context) => {
  if (req.method === "GET") {
    const gateway = Netlify.env.get("OPENAI_BASE_URL");
    return Response.json({ ready: Boolean(gateway), provider: gateway ? "Netlify AI Gateway" : null });
  }
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const body = (await req.json()) as ChatBody;
    const message = body.message?.trim();
    if (!message) return Response.json({ error: "Message is required" }, { status: 400 });
    const client = new OpenAI();
    const context = [body.city ? `Selected city: ${body.city}` : "", body.tripContext ? `TRAVO context: ${body.tripContext}` : ""].filter(Boolean).join("\n");
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: body.language === "en" ? SYSTEM_EN : SYSTEM_AR },
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
