const VITE_API = (import.meta?.env?.VITE_API_BASE_URL || '').replace(/\/$/, '')
const IS_TEST = typeof import.meta !== 'undefined' && !!import.meta.vitest

export const SITE = {
  title: 'Mukul Joshi | Portfolio',
  description: 'DevOps Engineer — Projects, blog, resume',
  baseUrl: '/',
  // Optional: configure to enable GitHub Actions status widgets and badges
  githubOwner: 'learning-new-things-daily', // e.g., 'mukuljoshi'
  githubRepo: 'mukul_joshi',  // e.g., 'learning-new-things-daily'
  // Force API in normal runtime; fall back to bundled data during tests
  dataSource: IS_TEST ? 'bundled' : 'api',
  dataRoot: 'data', // under public/ or served path
  apiBase: VITE_API, // set via VITE_API_BASE_URL
  validateData: true,
}
