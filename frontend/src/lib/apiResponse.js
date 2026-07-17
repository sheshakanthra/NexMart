export function ok(data, meta = {}) {
  return { success: true, data, meta, error: null };
}

export function fail(message, code = 'ERROR', details = null) {
  return { success: false, data: null, meta: {}, error: { message, code, details } };
}

export function paginated(data, total, page, pageSize) {
  return ok(data, {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
