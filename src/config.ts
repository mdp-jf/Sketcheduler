function requireEnv(name: string): string {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  supabase: {
    url: requireEnv('VITE_SUPABASE_URL'),
    anonKey: requireEnv('VITE_SUPABASE_ANON_KEY'),
  },
  app: {
    name: 'Drawing Learning Platform',
    version: '1.0.0',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '',
    timeout: 30000,
  },
};
