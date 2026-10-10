import { NextResponse } from 'next/server'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[+\d\s-]+$/

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

// Converts Arabic-Indic (٠-٩) and Persian (۰-۹) digits to 0-9
const normalizeDigits = (s: string) =>
  s
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const fields = {
      firstName: text(body?.firstName),
      lastName: text(body?.lastName),
      email: text(body?.email),
      phone: normalizeDigits(text(body?.phone)),
      company: text(body?.company),
      message: text(body?.message),
    }

    const digits = fields.phone.match(/\d/g)?.length ?? 0

    const errors: string[] = []
    if (fields.firstName.length < 2 || fields.firstName.length > 60) errors.push('firstName')
    if (fields.lastName.length > 60) errors.push('lastName')
    if (fields.email.length > 100 || (fields.email && !emailPattern.test(fields.email))) errors.push('email')
    if (fields.phone && (!phonePattern.test(fields.phone) || digits < 8 || digits > 20)) errors.push('phone')
    if (fields.company.length > 100) errors.push('company')
    if (fields.message.length > 1000) errors.push('message')
    if (!fields.email && !fields.phone) errors.push('contact')

    if (errors.length) {
      return NextResponse.json({ ok: false, error: 'Invalid contact details' }, { status: 400 })
    }

    const webhook = process.env.SHEETS_WEBHOOK_URL
    const secret = process.env.SHEETS_WEBHOOK_SECRET
    if (!webhook || !secret) {
      return NextResponse.json({ ok: false, error: 'Contact service is not configured' }, { status: 500 })
    }

    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...fields, secret }),
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    })

    // Temporary debug line: remove after the form works
    const raw = await response.text()
    console.error('Sheets webhook:', response.status, raw.slice(0, 300))
    const result = (() => { try { return JSON.parse(raw) } catch { return { ok: false } } })()

    return result.ok === true
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ ok: false }, { status: 502 })
  } catch {
    return NextResponse.json({ ok: false, error: 'Unexpected server error' }, { status: 500 })
  }
}