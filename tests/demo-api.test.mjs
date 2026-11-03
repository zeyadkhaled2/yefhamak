import test from 'node:test'
import assert from 'node:assert/strict'
import { api, ApiError, clearConnection, getConnection, normalizeBaseUrl, readSession, saveSession, setConnection } from '../lib/demo-api.ts'

test('backend URL rejects credentials, paths and insecure remote hosts', () => {
  assert.equal(normalizeBaseUrl('http://127.0.0.1:8000/'), 'http://127.0.0.1:8000')
  assert.equal(normalizeBaseUrl('https://backend.example'), 'https://backend.example')
  for (const url of ['http://remote.example', 'https://user:password@remote.example', 'https://remote.example/path', 'https://remote.example?token=x']) assert.throws(() => normalizeBaseUrl(url))
})
test('requests require an explicitly supplied key and never send cookies', async () => {
  const previous = globalThis.fetch
  const calls = []
  globalThis.fetch = async (url, init) => { calls.push({url, init}); return new Response(JSON.stringify({store:'Demo Store', live_chat_enabled:false})) }
  try {
    clearConnection()
    await assert.rejects(api.status(), /connect first/)
    assert.equal(calls.length, 0)
    setConnection({baseUrl:'http://127.0.0.1:8000', apiKey:'offline-key'})
    await api.status()
    assert.equal(calls[0].init.headers.Authorization, 'Bearer offline-key')
    assert.equal(calls[0].init.credentials, 'omit')
  } finally { globalThis.fetch = previous; clearConnection() }
})
test('transport retry uses the identical request id and text', async () => {
  const previous = globalThis.fetch
  const bodies = []
  globalThis.fetch = async (url, init) => { bodies.push(JSON.parse(init.body)); return new Response(JSON.stringify({reply:'saved'})) }
  try {
    setConnection({baseUrl:'http://localhost:8000', apiKey:'offline-key'})
    const pending = {conversationId:'conversation', requestId:'same-id', text:'hello'}
    await api.send(pending); await api.send(pending)
    assert.deepEqual(bodies[0], bodies[1])
    assert.equal(bodies[0].request_id, 'same-id')
  } finally { globalThis.fetch = previous; clearConnection() }
})
test('history collects all pages in backend order', async () => {
  const previous = globalThis.fetch
  let calls = 0
  globalThis.fetch = async () => { calls++; return new Response(JSON.stringify({items:calls === 1 ? Array.from({length:100},(_,i)=>({id:String(i)})) : [{id:'100'}]})) }
  try {
    setConnection({baseUrl:'http://localhost:8000', apiKey:'offline-key'})
    const messages = await api.history('conversation')
    assert.equal(messages.length, 101); assert.equal(messages[100].id, '100'); assert.equal(calls, 2)
  } finally { globalThis.fetch = previous; clearConnection() }
})
test('session state is backend-scoped and contains no access key', () => {
  const storage = new Map()
  globalThis.sessionStorage = {getItem:key=>storage.get(key)||null, setItem:(key,value)=>storage.set(key,value)}
  try {
    setConnection({baseUrl:'http://localhost:8000', apiKey:'never-store-this'})
    saveSession('conversation', {conversationId:'conversation',requestId:'pending-id',text:'sample message'})
    assert.equal(readSession().pending.requestId, 'pending-id')
    assert.equal([...storage.values()].join('').includes('never-store-this'), false)
    setConnection({baseUrl:'http://localhost:9000', apiKey:'another-key'})
    assert.equal(readSession().conversationId, null)
    clearConnection(); assert.equal(getConnection().apiKey, '')
  } finally { delete globalThis.sessionStorage; clearConnection() }
})
test('backend errors are actionable and never retried automatically', async () => {
  const previous = globalThis.fetch
  let calls = 0
  globalThis.fetch = async () => { calls++; return new Response(JSON.stringify({detail:'live_chat_disabled'}), {status:503}) }
  try {
    setConnection({baseUrl:'http://localhost:8000', apiKey:'offline-key'})
    await assert.rejects(api.status(), error=>error instanceof ApiError && error.code === 'live_chat_disabled')
    assert.equal(calls, 1)
  } finally { globalThis.fetch = previous; clearConnection() }
})

test('order review posts an authenticated action and surfaces conflicts without retrying', async () => {
  const previous = globalThis.fetch
  const calls = []
  globalThis.fetch = async (url, init) => {
    calls.push({url, init})
    return calls.length < 3 ? new Response(JSON.stringify({id:'order', status:calls.length === 1 ? 'CONFIRMED' : 'CANCELLED'}))
      : new Response(JSON.stringify({detail:'invalid_order_transition'}), {status:409})
  }
  try {
    setConnection({baseUrl:'http://localhost:8000', apiKey:'offline-key'})
    assert.equal((await api.reviewOrder('order', 'confirm')).status, 'CONFIRMED')
    assert.equal((await api.reviewOrder('order', 'cancel')).status, 'CANCELLED')
    await assert.rejects(api.reviewOrder('order', 'confirm'), error => error instanceof ApiError && error.code === 'invalid_order_transition')
    assert.equal(calls.length, 3)
    assert.equal(calls[0].url, 'http://localhost:8000/api/demo/orders/order/confirm')
    assert.equal(calls[1].url, 'http://localhost:8000/api/demo/orders/order/cancel')
    assert.equal(calls[0].init.method, 'POST')
    assert.equal(calls[0].init.headers.Authorization, 'Bearer offline-key')
    assert.equal(calls[0].init.credentials, 'omit')
  } finally { globalThis.fetch = previous; clearConnection() }
})
