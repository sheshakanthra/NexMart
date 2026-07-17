import * as storageApi from '../api/storage';
import { handleApiError } from '../lib/apiError';
import { ok } from '../lib/apiResponse';

export async function uploadProductImage(storeId, file) {
  try {
    const url = await storageApi.uploadProductImage(storeId, file);
    return ok(url);
  } catch (err) { handleApiError(err); }
}

export async function deleteProductImage(path) {
  try {
    await storageApi.deleteProductImage(path);
    return ok(null);
  } catch (err) { handleApiError(err); }
}
