import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'mock-db.json')

export type PageVisit = {
    id: string
    path: string
    createdAt: string
}

export type PilotRequest = {
    id: string
    name: string
    email: string
    company: string
    phone?: string
    needs?: string
    status: string
    createdAt: string
}

export type Inquiry = {
    id: string
    name: string
    email: string
    message: string
    type: string
    status: string
    createdAt: string
}

export type DBData = {
    pageVisits: PageVisit[]
    pilotRequests: PilotRequest[]
    inquiries: Inquiry[]
}

const initialData: DBData = {
    pageVisits: [],
    pilotRequests: [],
    inquiries: [],
}

function ensureDbExists() {
    if (!fs.existsSync(path.dirname(DB_PATH))) {
        fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
    }
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2))
    }
}

export function getDb(): DBData {
    ensureDbExists()
    const data = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(data)
}

export function saveDb(data: DBData) {
    ensureDbExists()
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

export function addPageVisit(path: string) {
    const db = getDb()
    const visit: PageVisit = {
        id: Math.random().toString(36).substring(7),
        path,
        createdAt: new Date().toISOString(),
    }
    db.pageVisits.push(visit)
    saveDb(db)
    return visit
}

export function addPilotRequest(data: Omit<PilotRequest, 'id' | 'createdAt' | 'status'>) {
    const db = getDb()
    const request: PilotRequest = {
        id: Math.random().toString(36).substring(7),
        ...data,
        status: 'NEW',
        createdAt: new Date().toISOString(),
    }
    db.pilotRequests.push(request)
    saveDb(db)
    return request
}

export function addInquiry(data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) {
    const db = getDb()
    const inquiry: Inquiry = {
        id: Math.random().toString(36).substring(7),
        ...data,
        status: 'NEW',
        createdAt: new Date().toISOString(),
    }
    db.inquiries.push(inquiry)
    saveDb(db)
    return inquiry
}
