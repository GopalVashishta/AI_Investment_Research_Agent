import { useState } from "react";
import Head from "next/head";
import ResearchForm from "@/components/ResearchForm";
import ResearchOutput from "@/components/ResearchOutput";
import api from "@/utils/api";


export default function Home() {
  const [researchResult, setResearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleResearchSubmit = async (companyName) => {
    setIsLoading(true);
    setError("");
    setResearchResult(null);

    try {
      const response = await api.post("/research", { companyName });

      setResearchResult({
        companyName,
        decision: response.data.decision,
        confidence: response.data.confidence,
        reasoning: response.data.reasoning,
        positives: response.data.positives,
        risks: response.data.risks,
        sourcesUsed: response.data.sourcesUsed,
      });
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.details ||
        err.message ||
        "Failed to complete research.";

      setError(message);
      setResearchResult({
        companyName,
        error: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AI Investment Research Agent</title>
        <meta name="description" content="AI agent for investment research" />
        <link rel="icon" href="/favicon.ico" />
        
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      </Head>

      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
          <section className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              AI Investment Research Agent
            </h1>
            <p className="mt-3 text-gray-600">
              Enter a company name and get a research-backed invest or pass decision.
            </p>
          </section>

          <ResearchForm onSubmit={handleResearchSubmit} isLoading={isLoading} />

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              <p className="font-medium">Error</p>
              <p className="mt-1">{error}</p>
            </div>
          ) : null}

          <ResearchOutput result={researchResult} />
        </div>
      </main>
    </>
  );
}