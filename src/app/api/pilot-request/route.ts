import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, company, phone, needs } = body

        if (!name || !email || !company) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const newRequest = await prisma.pilotRequest.create({
            data: {
                name,
                email,
                company,
                phone: phone || null,
                needs: needs || null,
            },
        })
        return NextResponse.json({ success: true, data: newRequest })
    } catch (error) {
        console.error('Error creating pilot request:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
