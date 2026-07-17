import * as notificationsApi from '../api/notifications';
import { handleApiError } from '../lib/apiError';
import { ok } from '../lib/apiResponse';

export async function getNotifications(userId, params) {
  try {
    const data = await notificationsApi.fetchNotifications(userId, params);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function markAllRead(userId) {
  try {
    await notificationsApi.markAllRead(userId);
    return ok(null);
  } catch (err) { handleApiError(err); }
}

export async function clearNotifications(userId) {
  try {
    await notificationsApi.clearNotifications(userId);
    return ok(null);
  } catch (err) { handleApiError(err); }
}

export function subscribeToNotifications(userId, onNotification) {
  return notificationsApi.subscribeToNotifications(userId, onNotification);
}
