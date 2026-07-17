const parseFlags = (raw) => {
  try { return JSON.parse(raw); } catch { return {}; }
};

const flags = {
  enableRealtime:      false,
  enableAI:            false,
  enableMapbox:        false,
  enableAnalytics:     false,
  enableNotifications: false,
  enableVendorApproval: true,
  enableSimulator:     true,
  ...parseFlags(process.env.REACT_APP_FEATURE_FLAGS ?? ''),
};

export default flags;
