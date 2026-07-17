import * as categoriesApi from '../api/categories';
import { handleApiError } from '../lib/apiError';
import { ok } from '../lib/apiResponse';

export async function getCategories() {
  try {
    const data = await categoriesApi.fetchCategories();
    return ok(data);
  } catch (err) { handleApiError(err); }
}
