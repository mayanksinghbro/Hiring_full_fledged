import { PrismaClient } from '@prisma/client'

/**
 * Prisma client singleton for use across the entire Next.js app.
 *
 * In development, Next.js hot-reloads modules on every save, which would
 * create a new PrismaClient instance each time and exhaust the DB connection
 * pool. We store a single instance on `globalThis` to prevent that.
 *
 * Usage:
 *   import { db } from '@/lib/db'
 *   const companies = await db.company.findMany()
 */

const globalForPrisma = globalThis

const db = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = db
}

export { db }
