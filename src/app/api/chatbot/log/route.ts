import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface LogPayload {
  sessionId: string
  nodeId: string
  choiceId?: string
  text?: string
  timestamp: number
  consent: boolean
  redacted?: boolean
  contains_pii?: boolean
}

interface LogEntry extends LogPayload {
  userAgent?: string | null
  ip?: string | null
  loggedAt: string
}

export async function POST(req: NextRequest) {
  try {
    const payload: LogPayload = await req.json()

    // Validate required fields
    if (!payload.sessionId || !payload.nodeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check for PII flag (should already be redacted client-side)
    if (payload.contains_pii || payload.redacted) {
      payload.redacted = true
    }

    // Create log entry
    const logEntry: LogEntry = {
      ...payload,
      userAgent: req.headers.get('user-agent'),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
      loggedAt: new Date().toISOString(),
    }

    // Try to write to file
    const logDir = path.join(process.cwd(), 'var')
    const logFile = path.join(logDir, 'chatbot-logs.json')

    try {
      // Ensure directory exists
      await fs.mkdir(logDir, { recursive: true })

      // Append to file (newline-delimited JSON)
      await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n', 'utf-8')
    } catch (fileError) {
      // Fallback to console if file write fails (e.g., in serverless environment)
      console.log('Chatbot log entry:', JSON.stringify(logEntry))
    }

    // Always respond with success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging chatbot interaction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

