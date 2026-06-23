import finnhub from "finnhub";
import { ChatGroq } from "@langchain/groq";
import { DynamicTool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import { z } from "zod";

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL_NAME = process.env.MODEL_NAME;

if (!FINNHUB_API_KEY) throw new Error("Missing FINNHUB_API_KEY");
if (!GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY");
if (!MODEL_NAME) throw new Error("Missing MODEL_NAME");

const finnhubClient = new finnhub.DefaultApi(FINNHUB_API_KEY);

const ResearchSchema = z.object({
  decision: z.enum(["Invest", "Pass"]),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
  positives: z.array(z.string()),
  risks: z.array(z.string()),
  sourcesUsed: z.array(z.string()),
});

function finnhubPromise(fn, ...args) {
  return new Promise((resolve, reject) => {
    fn(...args, (error, data) => {
      if (error) return reject(error);
      resolve(data);
    });
  });
}

async function resolveTicker(companyName) {
  const search = await finnhubPromise(finnhubClient.companySearch.bind(finnhubClient), companyName);
  const results = Array.isArray(search?.result) ? search.result : [];

  if (!results.length) return null;

  const q = companyName.toLowerCase();
  const best =
    results.find(
      (r) =>
        String(r.symbol || "").toLowerCase() === q ||
        String(r.description || "").toLowerCase().includes(q)
    ) || results[0];

  return best?.symbol || null;
}

async function getCompanySnapshot(companyName) {
  const symbol = await resolveTicker(companyName);
  if (!symbol) return JSON.stringify({ companyName, found: false });

  const [profile, quote, metrics] = await Promise.all([
    finnhubPromise(finnhubClient.companyProfile2.bind(finnhubClient), { symbol }),
    finnhubPromise(finnhubClient.quote.bind(finnhubClient), symbol),
    finnhubPromise(finnhubClient.basicFinancials.bind(finnhubClient), symbol, "all"),
  ]);

  return JSON.stringify({
    found: true,
    symbol,
    profile: {
      name: profile?.name ?? null,
      exchange: profile?.exchange ?? null,
      finnhubIndustry: profile?.finnhubIndustry ?? null,
      marketCapitalization: profile?.marketCapitalization ?? null,
      weburl: profile?.weburl ?? null,
    },
    quote: {
      current: quote?.c ?? null,
      change: quote?.d ?? null,
      changePercent: quote?.dp ?? null,
      high: quote?.h ?? null,
      low: quote?.l ?? null,
      open: quote?.o ?? null,
      previousClose: quote?.pc ?? null,
    },
    metrics: metrics?.metric ?? null,
  });
}

async function getRecentNews(companyName) {
  const symbol = await resolveTicker(companyName);
  if (!symbol) return JSON.stringify({ companyName, found: false, articles: [] });

  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 30);

  const article = await finnhubPromise(
    finnhubClient.companyNews.bind(finnhubClient),
    symbol,
    from.toISOString().slice(0, 10),
    to.toISOString().slice(0, 10)
  );
  
  const articles = (article || [])
  .slice(0, 3)
  .map((a) => ({
    headline: a.headline,
    source: a.source,
  }));


  return JSON.stringify({
    found: true,
    symbol,
    articles: articles || [],
  });
}

const tools = [
  new DynamicTool({
    name: "get_company_snapshot",
    description: "Get company profile, live quote, and financial metrics by company name.",
    func: getCompanySnapshot,
  }),
  new DynamicTool({
    name: "get_recent_news",
    description: "Get recent news for a company name.",
    func: getRecentNews,
  }),
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const companyName = String(req.body?.companyName || "").trim();
  if (!companyName) {
    return res.status(400).json({ error: "Company name is required." });
  }

  try {
    const model = new ChatGroq({
      apiKey: GROQ_API_KEY,
      model: MODEL_NAME,
      temperature: 0.2,
    });

    const agent = createAgent({
      model,
      tools,
      systemPrompt: `
You are an investment research agent.

Use the tools to research the company.
Base your answer on the data you actually retrieve.
Return a conservative decision: Invest or Pass.
If data is weak or incomplete, prefer Pass.
`,
      responseFormat: ResearchSchema,
    });

    const result = await agent.invoke({
      messages: [
        {
          role: "user",
          content: `Research ${companyName} and decide whether to invest or pass.`,
        },
      ],
    });

    if (!result?.structuredResponse) {
      throw new Error("No structured response returned by agent.");
    }

    return res.status(200).json({
      companyName,
      ...result.structuredResponse,
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: "Failed to perform research.",
      details: error?.message || "Unknown error",
    });
  }
}