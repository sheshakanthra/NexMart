import * as aiApi from '../api/ai';
import { handleApiError } from '../lib/apiError';
import { ok } from '../lib/apiResponse';

export async function getSentinelInsights(storeId) {
  try {
    const data = await aiApi.getSentinelInsights(storeId);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getRestockSuggestions(storeId) {
  try {
    const data = await aiApi.getRestockSuggestions(storeId);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getDemandForecast(productId, context) {
  try {
    const data = await aiApi.getDemandForecast(productId, context);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function chatWithAssistant(messages, context) {
  try {
    const data = await aiApi.chatWithAssistant(messages, context);
    return ok(data);
  } catch (err) { handleApiError(err); }
}
