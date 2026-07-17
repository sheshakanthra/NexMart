import * as cartApi from '../api/cart';
import { handleApiError } from '../lib/apiError';
import { ok } from '../lib/apiResponse';

export async function getCart(userId) {
  try {
    const data = await cartApi.fetchCart(userId);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function syncCart(userId, cartItems) {
  try {
    const data = await cartApi.syncCart(userId, cartItems);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function clearCart(userId) {
  try {
    await cartApi.clearCart(userId);
    return ok(null);
  } catch (err) { handleApiError(err); }
}
