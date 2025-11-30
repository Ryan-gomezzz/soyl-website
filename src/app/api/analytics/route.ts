import { NextResponse } from 'next/server'
import { addPageVisit } from '@/lib/mock-db'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { path } = body

        if (path) {
            addPageVisit(path)
        }
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
