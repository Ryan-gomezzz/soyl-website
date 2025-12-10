import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { path, userAgent, ip } = body

        if (path) {
            await prisma.pageVisit.create({
                data: {
                    path,
                    userAgent: userAgent || null,
                    ip: ip || null,
                },
            })
        }
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error recording page visit:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
