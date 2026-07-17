import * as authApi from '../api/auth';
import { handleApiError } from '../lib/apiError';
import { ok } from '../lib/apiResponse';

export async function signIn(credentials) {
  try {
    const data = await authApi.signIn(credentials);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function signUp(payload) {
  try {
    const data = await authApi.signUp(payload);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function signOut() {
  try {
    await authApi.signOut();
    return ok(null);
  } catch (err) { handleApiError(err); }
}

export async function getSession() {
  try {
    const data = await authApi.getSession();
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function resetPassword(email) {
  try {
    await authApi.resetPassword(email);
    return ok(null);
  } catch (err) { handleApiError(err); }
}

export async function getProfile(userId) {
  try {
    const data = await authApi.fetchProfile(userId);
    return ok(data);
  } catch (err) { handleApiError(err); }
}

export async function updateProfile(userId, patch) {
  try {
    const data = await authApi.updateProfile(userId, patch);
    return ok(data);
  } catch (err) { handleApiError(err); }
}
