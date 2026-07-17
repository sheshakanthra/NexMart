export const APP_NAME    = 'NexMart';
export const APP_VERSION = '1.0.0';

// Cart & order limits
export const DELIVERY_FEE     = 25;
export const MIN_ORDER_VALUE  = 100;
export const MAX_CART_QTY     = 20;

// Order lifecycle — must stay in sync with mock.js ORDER_STAGES
export const ORDER_STAGES = ['placed', 'accepted', 'packed', 'out_for_delivery', 'delivered'];
export const ORDER_STAGE_LABELS = {
  placed:           'Placed',
  accepted:         'Accepted',
  packed:           'Packed',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
};

// User roles — must match session.role values used in AppContext
export const USER_ROLES = {
  CUSTOMER: 'customer',
  VENDOR:   'vendor',
  ADMIN:    'admin',
};

// Store lifecycle
export const STORE_STATUS = {
  ACTIVE:    'active',
  PENDING:   'pending',
  SUSPENDED: 'suspended',
};

// Payment methods
export const PAYMENT_METHODS = {
  UPI: 'UPI',
  COD: 'COD',
};

// Notification kinds — matches AppContext NOTIFY kind values
export const NOTIFICATION_KINDS = {
  ORDER:  'order',
  STOCK:  'stock',
  SYSTEM: 'system',
  AI:     'ai',
};

// Stock health thresholds
export const STOCK_THRESHOLD_DEFAULT = 5;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE:     100,
};

// Notifications ring buffer size — mirrors AppContext slice(0, 50)
export const NOTIFICATION_MAX = 50;

// Realtime simulation tick — mirrors AppContext interval
export const SIM_TICK_MS = 3500;
