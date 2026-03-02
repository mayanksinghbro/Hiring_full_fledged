import { handlers } from '@/lib/auth'

/**
 * Next.js App Router catch-all API route for NextAuth.js
 * This handles all auth endpoints automatically:
 *   GET  /api/auth/signin
 *   POST /api/auth/signin/credentials
 *   GET  /api/auth/signout
 *   GET  /api/auth/session
 *   GET  /api/auth/csrf
 *   GET  /api/auth/providers
 *   GET  /api/auth/callback/:provider
 */
export const { GET, POST } = handlers
