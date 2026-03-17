export const spendOverTime = [
  { date: "Mar 1", spend: 42.5, projected: 45 },
  { date: "Mar 2", spend: 38.2, projected: 44 },
  { date: "Mar 3", spend: 55.8, projected: 48 },
  { date: "Mar 4", spend: 61.3, projected: 52 },
  { date: "Mar 5", spend: 49.7, projected: 50 },
  { date: "Mar 6", spend: 72.1, projected: 55 },
  { date: "Mar 7", spend: 68.4, projected: 58 },
  { date: "Mar 8", spend: 45.9, projected: 54 },
  { date: "Mar 9", spend: 53.2, projected: 56 },
  { date: "Mar 10", spend: 78.6, projected: 62 },
  { date: "Mar 11", spend: 82.1, projected: 68 },
  { date: "Mar 12", spend: 59.4, projected: 65 },
  { date: "Mar 13", spend: 67.8, projected: 66 },
  { date: "Mar 14", spend: 71.2, projected: 68 },
];

export const modelMix = [
  { name: "gpt-4-turbo", value: 45, cost: 892.4, color: "hsl(217, 91%, 60%)" },
  { name: "gpt-3.5-turbo", value: 28, cost: 124.8, color: "hsl(160, 84%, 39%)" },
  { name: "claude-3-opus", value: 15, cost: 456.2, color: "hsl(262, 83%, 58%)" },
  { name: "claude-3-sonnet", value: 8, cost: 89.3, color: "hsl(38, 92%, 50%)" },
  { name: "dall-e-3", value: 4, cost: 67.1, color: "hsl(350, 89%, 60%)" },
];

export const recommendations = [
  {
    id: 1,
    title: "Switch summarization pipeline to GPT-3.5",
    description: "Your summarization tasks show similar quality scores with GPT-3.5-turbo vs GPT-4. Estimated monthly savings.",
    savings: "$340/mo",
    impact: "low" as const,
    badge: "Recommended",
  },
  {
    id: 2,
    title: "Enable prompt caching for repeated queries",
    description: "42% of your API calls contain identical system prompts. Caching could reduce token usage significantly.",
    savings: "$128/mo",
    impact: "low" as const,
    badge: "Quick Win",
  },
  {
    id: 3,
    title: "Batch non-urgent classification requests",
    description: "Grouping classification calls into batches of 20 reduces overhead costs from per-request pricing.",
    savings: "$89/mo",
    impact: "medium" as const,
    badge: "Optimization",
  },
];

export const recentLogs = [
  { id: 1, model: "gpt-4-turbo", tokens: 2847, cost: 0.0854, latency: "1.2s", status: "success" as const, time: "2 min ago" },
  { id: 2, model: "claude-3-sonnet", tokens: 1203, cost: 0.0181, latency: "0.8s", status: "success" as const, time: "5 min ago" },
  { id: 3, model: "gpt-4-turbo", tokens: 4521, cost: 0.1356, latency: "2.1s", status: "error" as const, time: "8 min ago" },
  { id: 4, model: "gpt-3.5-turbo", tokens: 892, cost: 0.0013, latency: "0.4s", status: "success" as const, time: "12 min ago" },
  { id: 5, model: "dall-e-3", tokens: 0, cost: 0.04, latency: "3.8s", status: "success" as const, time: "15 min ago" },
];
