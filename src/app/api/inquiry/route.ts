import { NextResponse } from 'next/server'
import { addInquiry } from '@/lib/mock-db'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, message, type } = body

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const newInquiry = addInquiry({ name, email, message, type: type || 'GENERAL' })
        return NextResponse.json({ success: true, data: newInquiry })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
