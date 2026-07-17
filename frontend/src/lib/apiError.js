export class ApiError extends Error {
  constructor(message, code = 'ERROR', status = 500, details = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }

  static fromSupabase(error) {
    return new ApiError(
      error.message ?? 'Supabase error',
      error.code ?? 'SUPABASE_ERROR',
      error.status ?? 500,
      error.details ?? null
    );
  }

  static fromHttp(response, body) {
    return new ApiError(
      body?.message ?? response.statusText,
      body?.code ?? 'HTTP_ERROR',
      response.status,
      body?.details ?? null
    );
  }

  isNotFound()     { return this.status === 404; }
  isUnauthorized() { return this.status === 401; }
  isForbidden()    { return this.status === 403; }
  isConflict()     { return this.status === 409; }
  isServerError()  { return this.status >= 500; }
}

export function handleApiError(error) {
  if (error instanceof ApiError) throw error;
  // Supabase error shape: { message, code, status, details }
  if (error?.code !== undefined && error?.message) throw ApiError.fromSupabase(error);
  throw new ApiError(error?.message ?? 'Unknown error', 'UNKNOWN', 500);
}
