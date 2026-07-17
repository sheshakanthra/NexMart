const env = {
  supabaseUrl:     process.env.REACT_APP_SUPABASE_URL    ?? '',
  supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY ?? '',
  mapboxToken:     process.env.REACT_APP_MAPBOX_TOKEN    ?? '',
  appEnv:          process.env.REACT_APP_ENV             ?? 'development',
  isDev:           process.env.REACT_APP_ENV !== 'production',
  isProd:          process.env.REACT_APP_ENV === 'production',
};

export default env;
