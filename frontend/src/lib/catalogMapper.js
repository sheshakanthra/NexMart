// Maps raw Supabase DB rows → the frontend shape the rest of the app expects.
// Keep these pure — no side effects, no async, no imports from Supabase.

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop';
const FALLBACK_IMG   = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop';

export function mapStore(row) {
  return {
    id:                row.id,
    name:              row.name,
    owner:             row.owner_name        || 'Owner',
    neighborhood:      row.neighborhood      || 'Chennai',
    rating:            parseFloat(row.rating) || 4.5,
    distanceKm:        parseFloat(row.distance_km) || 1.0,
    etaMin:            row.eta_min           || 20,
    open:              row.open              ?? true,
    deliveryRadiusKm:  parseFloat(row.delivery_radius_km) || 3.0,
    hours:             row.hours             || '7:00 AM – 10:00 PM',
    status:            row.status            || 'active',
    tags:              row.tags              || [],
    cover:             row.cover_url         || FALLBACK_COVER,
    healthScore:       row.health_score      || 80,
    description:       row.description       || '',
    products:          [],
  };
}

export function mapProduct(row) {
  // inventory may be a single object (1:1 FK) or a 1-element array depending on PostgREST version
  const inv = Array.isArray(row.inventory) ? row.inventory[0] : row.inventory;

  const rawTrend = row.trend;
  const trend = Array.isArray(rawTrend)
    ? rawTrend
    : (typeof rawTrend === 'string' ? JSON.parse(rawTrend) : [10,12,14,13,15,18,20]);

  return {
    id:          row.id,
    storeId:     row.store_id,
    name:        row.name,
    category:    row.category_id  || 'staples',
    price:       parseFloat(row.price) || 0,
    unit:        row.unit         || '1 unit',
    img:         row.image_url    || FALLBACK_IMG,
    description: row.description  || '',
    active:      row.active       ?? true,
    trend,
    soldToday:   row.sold_today   || 0,
    stock:       inv?.stock       ?? 0,
    threshold:   inv?.threshold   ?? 5,
  };
}

export function mapStoreWithProducts(storeRow) {
  const store    = mapStore(storeRow);
  store.products = (storeRow.products || []).map(mapProduct);
  return store;
}

// Reverse-map frontend patch object → Supabase column names for UPDATE calls
export function toStoreColumns(patch) {
  const cols = {};
  if (patch.name              !== undefined) cols.name               = patch.name;
  if (patch.owner             !== undefined) cols.owner_name         = patch.owner;
  if (patch.neighborhood      !== undefined) cols.neighborhood       = patch.neighborhood;
  if (patch.rating            !== undefined) cols.rating             = patch.rating;
  if (patch.distanceKm        !== undefined) cols.distance_km        = patch.distanceKm;
  if (patch.etaMin            !== undefined) cols.eta_min            = patch.etaMin;
  if (patch.open              !== undefined) cols.open               = patch.open;
  if (patch.deliveryRadiusKm  !== undefined) cols.delivery_radius_km = patch.deliveryRadiusKm;
  if (patch.hours             !== undefined) cols.hours              = patch.hours;
  if (patch.status            !== undefined) cols.status             = patch.status;
  if (patch.tags              !== undefined) cols.tags               = patch.tags;
  if (patch.cover             !== undefined) cols.cover_url          = patch.cover;
  if (patch.healthScore       !== undefined) cols.health_score       = patch.healthScore;
  if (patch.description       !== undefined) cols.description        = patch.description;
  return cols;
}

export function toProductColumns(patch) {
  const cols = {};
  if (patch.name        !== undefined) cols.name        = patch.name;
  if (patch.category    !== undefined) cols.category_id = patch.category;
  if (patch.price       !== undefined) cols.price       = patch.price;
  if (patch.unit        !== undefined) cols.unit        = patch.unit;
  if (patch.img         !== undefined) cols.image_url   = patch.img;
  if (patch.description !== undefined) cols.description = patch.description;
  if (patch.active      !== undefined) cols.active      = patch.active;
  if (patch.trend       !== undefined) cols.trend       = patch.trend;
  if (patch.soldToday   !== undefined) cols.sold_today  = patch.soldToday;
  return cols;
}
