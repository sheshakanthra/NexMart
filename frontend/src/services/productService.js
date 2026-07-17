import * as productsApi from '../api/products';
import { handleApiError } from '../lib/apiError';
import { ok } from '../lib/apiResponse';
import { mapProduct } from '../lib/catalogMapper';

export async function getProducts(params) {
  try {
    const data = await productsApi.fetchProducts(params);
    return ok(data.map(mapProduct));
  } catch (err) { handleApiError(err); }
}

export async function getProductById(productId) {
  try {
    const data = await productsApi.fetchProductById(productId);
    return ok(mapProduct(data));
  } catch (err) { handleApiError(err); }
}

export async function searchProducts(params) {
  try {
    const data = await productsApi.searchProducts(params);
    return ok(data.map(mapProduct));
  } catch (err) { handleApiError(err); }
}

export async function createProduct(storeId, product) {
  try {
    const data = await productsApi.createProduct(storeId, product);
    return ok(mapProduct(data));
  } catch (err) { handleApiError(err); }
}

export async function updateProduct(productId, patch) {
  try {
    const data = await productsApi.updateProduct(productId, patch);
    return ok(mapProduct(data));
  } catch (err) { handleApiError(err); }
}

export async function deleteProduct(productId) {
  try {
    await productsApi.deleteProduct(productId);
    return ok(null);
  } catch (err) { handleApiError(err); }
}

export async function updateStock(productId, stock) {
  try {
    const data = await productsApi.updateStock(productId, stock);
    return ok(data);
  } catch (err) { handleApiError(err); }
}
