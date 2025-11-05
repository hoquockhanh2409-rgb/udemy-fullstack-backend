import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as any
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Ensure upload dir exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true })

    const originalName = (file.name || 'upload').toString()
    const safeName = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const outPath = path.join(UPLOAD_DIR, safeName)
    await fs.writeFile(outPath, buffer)

    const url = `/uploads/${safeName}`
    return NextResponse.json({ ok: true, url })
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
