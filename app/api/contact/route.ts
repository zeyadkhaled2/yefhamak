import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL
  if (!webhookUrl) return NextResponse.json({ error: 'Contact webhook is not configured' }, { status: 503 })

  const payload = await request.json()
  if (!payload.firstName || !payload.lastName || !payload.email || !payload.message) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

  const response = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, source: 'yefhamak-contact-page', submittedAt: new Date().toISOString() }) })
  if (!response.ok) return NextResponse.json({ error: 'Webhook rejected the submission' }, { status: 502 })
  return NextResponse.json({ ok: true })
}
