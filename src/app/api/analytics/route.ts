import { NextResponse } from 'next/server'
import prisma, { safePrismaOperation, isDatabaseConnectionError } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { path, userAgent, ip } = body

        // Only record if path is provided
        if (!path) {
            return NextResponse.json({ success: true })
        }

        // Attempt to record page visit, but fail silently if database is unavailable
        const result = await safePrismaOperation(
            async () => {
                return await prisma.pageVisit.create({
                    data: {
                        path,
                        userAgent: userAgent || null,
                        ip: ip || null,
                    },
                })
            }
        )

        if (!result.success) {
            // Log error but don't fail the request - analytics shouldn't break pages
            if (isDatabaseConnectionError(result.error as any)) {
                // Only log connection errors at debug level to avoid spam
                if (process.env.NODE_ENV === 'development') {
                    console.warn('[Analytics] Database unavailable, skipping page visit recording:', result.error)
                }
            } else {
                // Log other errors more prominently
                console.error('[Analytics] Failed to record page visit:', result.error)
            }
        }

        // Always return success to prevent breaking the page
        // Analytics failures should be silent from the user's perspective
        return NextResponse.json({ success: true })
    } catch (error) {
        // Catch any unexpected errors (e.g., JSON parsing)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        
        // Log but still return success - analytics should never break pages
        console.error('[Analytics] Unexpected error:', errorMessage)
        
        // Return success to prevent page errors
        return NextResponse.json({ success: true })
    }
}
