import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { db } from '@/lib/db'

/**
 * NextAuth.js configuration
 *
 * Providers:
 *  - Email/Password (Credentials) — for students, college admins, company HR
 *  - Google OAuth — optional, easy one-click login
 *
 * The PrismaAdapter automatically manages User, Account, Session, and
 * VerificationToken tables in your Neon database.
 *
 * Usage — import the handler in the API route:
 *   import { handlers } from '@/lib/auth'
 *   export const { GET, POST } = handlers
 *
 * Usage — get session in Server Components:
 *   import { auth } from '@/lib/auth'
 *   const session = await auth()
 */

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),

    providers: [
        // ── Google OAuth ──────────────────────────────────────────
        // Uncomment and add GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET to .env.local
        // GoogleProvider({
        //   clientId: process.env.GOOGLE_CLIENT_ID,
        //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // }),

        // ── Email + Password ──────────────────────────────────────
        CredentialsProvider({
            name: 'Email & Password',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // TODO: Add proper password hashing (bcrypt) when you build the sign-up flow.
                // For now this is a placeholder that checks the DB for an existing user.
                if (!credentials?.email) return null

                const user = await db.user.findUnique({
                    where: { email: credentials.email },
                })

                if (!user) return null
                // Return the user — NextAuth creates the session automatically
                return user
            },
        }),
    ],

    session: {
        strategy: 'jwt', // JWT sessions — no extra DB call per request
    },

    callbacks: {
        // Attach our custom fields (role, id) to the JWT token
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },

        // Attach role + id to the session object so the frontend can read them
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.role = token.role
            }
            return session
        },
    },

    pages: {
        signIn: '/auth/login',  // your custom login page (build this later)
    },
})
