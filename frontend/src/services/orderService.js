import * as ordersApi from '../api/orders';
import { handleApiError } from '../lib/apiError';
import { ok } from '../lib/apiResponse';

export async function getOrders(params) {
  try {
    const data = await ordersApi.fetchOrders(params);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function getOrderById(orderId) {
  try {
    const data = await ordersApi.fetchOrderById(orderId);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function placeOrder(payload) {
  try {
    const data = await ordersApi.placeOrder(payload);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const data = await ordersApi.updateOrderStatus(orderId, status);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function cancelOrder(orderId, reason) {
  try {
    await ordersApi.cancelOrder(orderId, reason);
    return ok(null);
  } catch (err) { handleApiError(err); }
}

export async function getOrderTimeline(orderId) {
  try {
    const data = await ordersApi.fetchOrderTimeline(orderId);
    return ok(data);
  } catch (err) { handleApiError(err); }
}
