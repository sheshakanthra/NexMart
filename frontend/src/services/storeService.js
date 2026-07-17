import * as storesApi from '../api/stores';
import { handleApiError } from '../lib/apiError';
import { ok } from '../lib/apiResponse';
import { mapStoreWithProducts, mapStore } from '../lib/catalogMapper';

export async function getStores(params) {
  try {
    const data = await storesApi.fetchStores(params);
    return ok(data.map(mapStoreWithProducts));
  } catch (err) { handleApiError(err); }
}

export async function getStoreById(storeId) {
  try {
    const data = await storesApi.fetchStoreById(storeId);
    return ok(mapStoreWithProducts(data));
  } catch (err) { handleApiError(err); }
}

export async function getStoresByVendor(vendorId) {
  try {
    const data = await storesApi.fetchStoresByVendor(vendorId);
    return ok(data.map(mapStoreWithProducts));
  } catch (err) { handleApiError(err); }
}

export async function searchStores(params) {
  try {
    const data = await storesApi.searchStores(params);
    return ok(data.map(mapStore));
  } catch (err) { handleApiError(err); }
}

export async function updateStore(storeId, patch) {
  try {
    const data = await storesApi.updateStore(storeId, patch);
    return ok(mapStore(data));
  } catch (err) { handleApiError(err); }
}

export async function getNearbyStores(params) {
  try {
    const data = await storesApi.fetchNearbyStores(params);
    return ok(data.map(mapStoreWithProducts));
  } catch (err) { handleApiError(err); }
}
