import * as adminApi from '../api/admin';
import { handleApiError } from '../lib/apiError';
import { ok } from '../lib/apiResponse';

export async function getAdminDashboard() {
  try {
    const data = await adminApi.fetchAdminDashboard();
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getAllVendors(params) {
  try {
    const data = await adminApi.fetchAllVendors(params);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function approveVendor(vendorId) {
  try {
    const data = await adminApi.approveVendor(vendorId);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function suspendVendor(vendorId, reason) {
  try {
    const data = await adminApi.suspendVendor(vendorId, reason);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getPlatformAnalytics(params) {
  try {
    const data = await adminApi.fetchPlatformAnalytics(params);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getInventoryHealth() {
  try {
    const data = await adminApi.fetchInventoryHealth();
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getLiveOrderStream(params) {
  try {
    const data = await adminApi.fetchLiveOrderStream(params);
    return ok(data);
  } catch (err) { handleApiError(err); }
}
