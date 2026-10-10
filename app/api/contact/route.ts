import { NextResponse } from 'next/server'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[+\d\s-]+$/

function text(value: unknown) { return typeof value === 'string' ? value.trim() : '' }

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const fields = { firstName: text(body.firstName), lastName: text(body.lastName), email: text(body.email), phone: text(body.phone), company: text(body.company), message: text(body.message), website: text(body.website) }
    if (fields.website) return NextResponse.json({ ok: true })
    const digits = fields.phone.match(/\d/g)?.length ?? 0
    const invalid = !fields.firstName || fields.firstName.length < 2 || fields.firstName.length > 60 || fields.lastName.length > 60 || fields.email.length > 100 || (fields.email && !emailPattern.test(fields.email)) || (fields.phone && (!phonePattern.test(fields.phone) || digits < 8 || digits > 20)) || fields.company.length > 100 || fields.message.length > 1000 || (!fields.email && !fields.phone)
    if (invalid) return NextResponse.json({ ok: false, error: 'Invalid contact details' }, { status: 400 })
    const webhook = process.env.SHEETS_WEBHOOK_URL
    const secret = process.env.SHEETS_WEBHOOK_SECRET
    if (!webhook || !secret) return NextResponse.json({ ok: false, error: 'Contact service is not configured' }, { status: 500 })
    const response = await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ ...fields, secret }), redirect: 'follow' })
    const result = await response.json().catch(() => ({ ok: false }))
    return NextResponse.json({ ok: result.ok === true }, { status: result.ok === true ? 200 : 400 })
  } catch {
    return NextResponse.json({ ok: false, error: 'Unexpected server error' }, { status: 500 })
  }
}
