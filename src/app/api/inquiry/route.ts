import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, message, type } = body

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const newInquiry = await prisma.inquiry.create({
            data: {
                name,
                email,
                message,
                type: type || 'GENERAL',
            },
        })
        return NextResponse.json({ success: true, data: newInquiry })
    } catch (error) {
        console.error('Error creating inquiry:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
