import * as inventoryApi from '../api/inventory';
import { handleApiError } from '../lib/apiError';
import { ok } from '../lib/apiResponse';

export async function updateStock(productId, stock) {
  try {
    const data = await inventoryApi.updateStock(productId, stock);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function upsertInventory(productId, patch) {
  try {
    const data = await inventoryApi.upsertInventory(productId, patch);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getInventoryByProduct(productId) {
  try {
    const data = await inventoryApi.fetchInventoryByProduct(productId);
    return ok(data);
  } catch (err) { handleApiError(err); }
}
