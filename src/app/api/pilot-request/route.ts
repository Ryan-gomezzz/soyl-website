import { NextResponse } from 'next/server'
import { addPilotRequest } from '@/lib/mock-db'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, company, phone, needs } = body

        if (!name || !email || !company) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const newRequest = addPilotRequest({ name, email, company, phone, needs })
        return NextResponse.json({ success: true, data: newRequest })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
