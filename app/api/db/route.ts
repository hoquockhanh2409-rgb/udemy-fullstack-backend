import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.json')

async function readDb() {
  const raw = await fs.readFile(DB_PATH, 'utf-8')
  return JSON.parse(raw)
}

async function writeDb(db: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8')
}

export async function GET() {
  try {
    const db = await readDb()
    return NextResponse.json(db)
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

/**
 * POST payload options:
 * - { section: 'users'|'toys'|'borrows', data: [...] } -> updates that section
 * - { db: { ... } } -> replace entire DB
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const db = await readDb()

    if (body && body.section && Object.prototype.hasOwnProperty.call(db, body.section)) {
      db[body.section] = body.data
      await writeDb(db)
      return NextResponse.json({ ok: true, section: body.section, data: db[body.section] })
    }

    if (body && body.db) {
      await writeDb(body.db)
      return NextResponse.json({ ok: true, db: body.db })
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
