import * as analyticsApi from '../api/analytics';
import { handleApiError } from '../lib/apiError';
import { ok } from '../lib/apiResponse';

export async function getHourlySales(storeId, date) {
  try {
    const data = await analyticsApi.fetchHourlySales(storeId, date);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getRevenueTrend(storeId, params) {
  try {
    const data = await analyticsApi.fetchRevenueTrend(storeId, params);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getCategoryPerformance(storeId) {
  try {
    const data = await analyticsApi.fetchCategoryPerformance(storeId);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getDemandForecast(productId) {
  try {
    const data = await analyticsApi.fetchDemandForecast(productId);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getNeighborhoodTrends() {
  try {
    const data = await analyticsApi.fetchNeighborhoodTrends();
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getCustomerGrowth(params) {
  try {
    const data = await analyticsApi.fetchCustomerGrowth(params);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getOrderFunnel(storeId) {
  try {
    const data = await analyticsApi.fetchOrderFunnel(storeId);
    return ok(data);
  } catch (err) { handleApiError(err); }
}
