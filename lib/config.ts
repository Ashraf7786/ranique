const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') return '/api';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api`;
  return 'http://localhost:3000/api';
};

export const API_URL = getBaseUrl();
