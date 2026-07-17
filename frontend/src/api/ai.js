// TODO Phase 4: Implement via Supabase Edge Function proxy
// GROQ_API_KEY must stay server-side — never call Groq directly from the browser.
// All AI calls route through an Edge Function that holds the secret key.

export async function getSentinelInsights(storeId) {
  // TODO: POST /functions/v1/sentinel-insights { store_id: storeId }
  throw new Error('Not implemented');
}

export async function getRestockSuggestions(storeId) {
  // TODO: POST /functions/v1/restock-suggestions { store_id: storeId }
  throw new Error('Not implemented');
}

export async function getDemandForecast(productId, context) {
  // TODO: POST /functions/v1/demand-forecast { product_id: productId, context }
  throw new Error('Not implemented');
}

export async function chatWithAssistant(messages, context) {
  // TODO: POST /functions/v1/ai-chat { messages, context }
  // messages: [{ role: 'user' | 'assistant', content: string }]
  throw new Error('Not implemented');
}

export async function classifyDemandPattern(productId, salesHistory) {
  // TODO: POST /functions/v1/classify-demand { product_id: productId, sales_history: salesHistory }
  throw new Error('Not implemented');
}
