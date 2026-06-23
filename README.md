# AI Investment Research Agent

## Overview

AI Investment Research Agent is a full-stack Next.js application that researches a company and returns an investment recommendation: **Invest** or **Pass**.

The agent uses external financial data sources, gathers company information and recent news, then uses a Groq-hosted LLM through LangChain to generate a structured investment report containing:

* Decision (Invest / Pass)
* Confidence score
* Reasoning
* Positive factors
* Risks
* Data sources used

---

## How to Run

### Prerequisites

* Node.js 18+
* Groq API Key
* Finnhub API Key

### Installation

```bash
git clone <repository-url>
cd investment-research-agent

npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
MODEL_NAME=openai/gpt-oss-120b (preferred) || openai/gpt-oss-20b

FINNHUB_API_KEY=your_finnhub_api_key
```

### Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## How It Works

### Architecture

```text
User
  ↓
Next.js Frontend
  ↓
/api/research
  ↓
LangChain Agent
  ↓
Financial Tools
  ├── Company Snapshot
  └── Recent News
  ↓
Groq LLM
  ↓
Structured Investment Report
```

### Workflow

1. User enters a company name.
2. The frontend sends a request to `/api/research`.
3. A LangChain agent is created using a Groq model.
4. The agent calls tools to gather:

   * Company profile
   * Stock quote
   * Financial metrics
   * Recent company news
5. The LLM analyzes the collected information.
6. The response is returned as structured JSON.
7. The frontend displays the final report.

### Tech Stack

* Next.js
* React
* LangChain.js
* Groq
* Finnhub
* Tailwind CSS
* Axios
* Zod

---

## Key Decisions & Trade-offs

### Next.js Full-Stack Architecture

Frontend and backend are kept in a single project, making development and deployment simpler.

**Benefit:** Faster development and deployment.

**Trade-off:** API routes share resources with frontend hosting.

---

### LangChain Agent

LangChain was used to enable tool-calling and reasoning over external data.

**Benefit:** Clear separation between data gathering and decision making.

**Trade-off:** Additional complexity compared to a single LLM call.

---

### Finnhub for Financial Data

Finnhub provides company information, stock data, and news through a single API.

**Benefit:** Simple integration and sufficient data for an MVP.

**Trade-off:** Free-tier rate limits restrict the amount of data available.

---

### Structured Output

The agent returns validated JSON rather than parsing free-form text.

**Benefit:** Reliable frontend integration.

**Trade-off:** Slightly less flexibility in generated responses.

---

### Lightweight Research Scope

The agent focuses on company profile data and recent news.

**Included**

* Company information
* Stock quote
* Financial metrics
* Recent news

**Not Included**

* SEC filings
* Earnings call transcripts
* Analyst reports
* DCF valuation models
* Portfolio optimization

These were intentionally left out to keep response times low and remain within free-tier API limits.

---

## Example Runs

### Apple Inc.

**Decision:** Invest

**Confidence:** 0.82

**Positives**

* Strong brand and ecosystem
* Large market capitalization
* Positive recent news sentiment

**Risks**

* Regulatory pressure
* Dependence on flagship products

**Reasoning**

Apple maintains a strong competitive position, healthy financial profile, and positive market sentiment. Recent news indicates continued growth initiatives and product expansion. Risks exist, but overall fundamentals remain favorable.

---

### Tesla Inc.
**Decision:** Pass

**Confidence:** 0.6

**Positives**
* Strong brand
* Innovative products
* Risks
* High valuation
* Increasing competition

**Reasoning**

Based on the company profile and financial metrics, the company's valuation seems high and the competition in the electric vehicle market is increasing.

---

### Microsoft Corporation

**Decision:** Invest

**Confidence:** 0.88

**Positives**

* Strong cloud business growth
* Diversified revenue streams
* Consistent profitability

**Risks**

* Regulatory scrutiny
* Dependence on enterprise spending

**Reasoning**

Microsoft demonstrates strong financial performance and sustained growth in strategic areas such as cloud computing and AI. The company's diversified business model reduces overall investment risk.

---

## What I Would Improve With More Time

### Better Data Sources

Add:

* SEC filings
* Earnings transcripts
* Analyst ratings
* Institutional ownership data

This would provide deeper research than company news alone.

---

### Retrieval-Augmented Generation (RAG)

Store financial documents in a vector database and allow the agent to retrieve relevant evidence before generating recommendations.

Possible options:

* Pinecone
* Supabase Vector
* Weaviate

---

### Multi-Agent Research

Split responsibilities across specialized agents:

* News Analyst
* Financial Analyst
* Risk Analyst
* Investment Decision Agent

This would improve transparency and reasoning quality.

---

### Caching & Rate-Limit Handling

Implement caching for Finnhub responses and automatic retries for API rate limits to improve reliability and reduce costs.

---

### Portfolio-Level Analysis

Allow users to compare multiple companies and generate ranked investment recommendations instead of analyzing a single company at a time.