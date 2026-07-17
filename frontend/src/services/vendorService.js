import * as vendorApi from '../api/vendor';
import { handleApiError } from '../lib/apiError';
import { ok } from '../lib/apiResponse';

export async function getVendorDashboard(vendorId) {
  try {
    const data = await vendorApi.fetchVendorDashboard(vendorId);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getVendorOrders(storeId, params) {
  try {
    const data = await vendorApi.fetchVendorOrders(storeId, params);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function acceptOrder(orderId) {
  try {
    const data = await vendorApi.acceptOrder(orderId);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getVendorInventory(storeId) {
  try {
    const data = await vendorApi.fetchVendorInventory(storeId);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getVendorAnalytics(storeId, params) {
  try {
    const data = await vendorApi.fetchVendorAnalytics(storeId, params);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function updateVendorStore(storeId, patch) {
  try {
    const data = await vendorApi.updateVendorStore(storeId, patch);
    return ok(data);
  } catch (err) { handleApiError(err); }
}
