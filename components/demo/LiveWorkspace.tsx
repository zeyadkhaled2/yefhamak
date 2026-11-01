'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUp, CheckCheck, ChevronRight, MessageCircle, ShoppingBag, X } from 'lucide-react'
import { api, clearConnection, getConnection, readSession, saveSession, setConnection, type ApiConversation, type ApiMessage, type ApiOrderDetail, type OrderPage, type PendingMessage } from '@/lib/demo-api'
import { money } from '@/lib/demo-store'

const failure = (e: unknown) => e instanceof Error ? e.message : 'The operation could not be completed.'
const timestamp = (value: string) => new Date(value).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const statusLabel = (status: string) => status === 'PENDING' ? 'Pending review' : status === 'CONFIRMED' ? 'Confirmed' : 'Cancelled'

export default function LiveWorkspace({ view }: { view: 'chat' | 'orders' }) {
  const saved = getConnection()
  const [baseUrl, setBaseUrl] = useState(saved.baseUrl)
  const [apiKey, setApiKey] = useState(saved.apiKey)
  const [connected, setConnected] = useState(false)
  const [liveEnabled, setLiveEnabled] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [conversation, setConversation] = useState<ApiConversation | null>(null)
  const [messages, setMessages] = useState<ApiMessage[]>([])
  const [pending, setPending] = useState<PendingMessage | null>(null)
  const [input, setInput] = useState('')
  const [orders, setOrders] = useState<OrderPage>({ items: [], total: 0, limit: 25, offset: 0 })
  const [filter, setFilter] = useState('')
  const [query, setQuery] = useState('')
  const [offset, setOffset] = useState(0)
  const [detail, setDetail] = useState<ApiOrderDetail | null>(null)
  const [refreshVersion, setRefreshVersion] = useState(0)
  const active = useRef(false)
  const mounted = useRef(true)
  const bottom = useRef<HTMLDivElement>(null)
  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
  useEffect(() => { bottom.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) }, [messages, pending])

  async function connect(event?: FormEvent) {
    event?.preventDefault()
    if (active.current) return
    active.current = true; setBusy(true); setError(''); setNotice(''); setConnected(false)
    try {
      setConnection({ baseUrl, apiKey })
      const status = await api.status()
      const session = readSession()
      let current: ApiConversation | null = null
      let history: ApiMessage[] = []
      if (session.conversationId) {
        try { current = await api.conversation(session.conversationId); history = await api.history(session.conversationId) }
        catch (e) { setNotice(`Could not restore the saved conversation: ${failure(e)} You can start a new conversation. Uncertain requests are kept for inspection.`) }
      }
      if (!mounted.current) return
      setConversation(current); setMessages(history); setPending(session.pending)
      setLiveEnabled(status.live_chat_enabled); setConnected(true)
      if (!status.live_chat_enabled) setNotice('Backend connected. Live sending is disabled, so connecting and browsing orders use no model quota.')
    } catch (e) { if (mounted.current) setError(failure(e)); clearConnection() }
    finally { active.current = false; if (mounted.current) setBusy(false) }
  }
  // Reuse only credentials already entered in this tab; reload deliberately asks again.
  useEffect(() => { if (getConnection().apiKey) void connect() }, [])

  useEffect(() => {
    if (!connected || view !== 'orders') return
    const controller = new AbortController()
    setLoading(true); setOrders({ items: [], total: 0, limit: 25, offset }); setError('')
    const timer = setTimeout(() => {
      api.orders(filter, query, offset, controller.signal).then(page => { if (!controller.signal.aborted) setOrders(page) })
        .catch(e => { if (!controller.signal.aborted) setError(failure(e)) })
        .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    }, 250)
    return () => { clearTimeout(timer); controller.abort() }
  }, [connected, view, filter, query, offset, refreshVersion])

  async function refreshHistory() {
    if (!conversation || active.current) return
    active.current = true; setBusy(true); setError('')
    try { setMessages(await api.history(conversation.id)); setConversation(await api.conversation(conversation.id)) }
    catch (e) { setError(failure(e)) }
    finally { active.current = false; if (mounted.current) setBusy(false) }
  }
  function newConversation() {
    if (active.current) return
    if (pending) { setError('An uncertain request remains. Check it and inspect orders/history before starting another conversation.'); return }
    try { saveSession(null, null); setConversation(null); setMessages([]); setInput(''); setError(''); setNotice('Your previous conversation remains in the backend; this starts a fresh one.') }
    catch (e) { setError(failure(e)) }
  }
  function leaveUncertainConversation() {
    if (active.current || !window.confirm('First inspect history and orders. The message may already have changed inventory or created an order. Leave this conversation and start a separate one? This does not cancel any backend action.')) return
    try { saveSession(null, null); setPending(null); setConversation(null); setMessages([]); setError(''); setNotice('Started a separate conversation. The old request and any orders remain in the backend.') }
    catch (e) { setError(failure(e)) }
  }
  async function send(retry?: PendingMessage) {
    if (active.current || !connected || !liveEnabled || (!retry && (!input.trim() || pending))) return
    active.current = true; setBusy(true); setError(''); setNotice('')
    try {
      let current = conversation
      if (!retry && !current) { current = await api.createConversation(); setConversation(current); saveSession(current.id, null) }
      const turn: PendingMessage = retry || { conversationId: current!.id, requestId: crypto.randomUUID(), text: input.trim() }
      // Persist before POST. A retry always uses this exact ID and text, even after reload.
      saveSession(turn.conversationId, turn); setPending(turn); setInput('')
      const result = await api.send(turn)
      saveSession(turn.conversationId, null); setPending(null)
      setConversation(previous => ({ id: turn.conversationId, created_at: previous?.created_at || new Date().toISOString(), status: result.status }))
      if (result.outcome === 'provider_error') setNotice(result.rate_limited ? 'The provider rate limit was reached. No automatic retries will be made. Inspect history/orders and wait for available quota.' : 'The provider could not complete the reply. Inspect history and orders before sending another message.')
      else if (result.outcome === 'application_error') setNotice('The backend reported an application error. Inspect history/orders and backend logs before continuing.')
      else if (result.outcome === 'handoff') setNotice('This conversation has been handed to a person. The assistant is paused.')
      try { setMessages(await api.history(turn.conversationId)) }
      catch { setNotice('The request completed, but history could not refresh. Use Refresh history; do not resend the message.') }
    } catch (e) { if (mounted.current) setError(failure(e)) }
    finally { active.current = false; if (mounted.current) setBusy(false) }
  }
  async function inspectOrder(id: string) {
    if (active.current) return
    active.current = true; setBusy(true); setError('')
    try { setDetail(await api.order(id)) } catch (e) { setError(failure(e)) }
    finally { active.current = false; if (mounted.current) setBusy(false) }
  }
  function disconnect() { if (active.current) return; clearConnection(); setApiKey(''); setConnected(false); setMessages([]); setOrders({ items: [], total: 0, limit: 25, offset: 0 }); setDetail(null); setError(''); setNotice('Disconnected. The key was removed from tab memory.') }

  return <div className="demo-app" dir="ltr" lang="en" data-live-busy={busy}>
    <aside className="demo-sidebar"><Link href="/" className="demo-brand"><img src="/yefhamak-logo.png" alt="" className="brand-logo" /><span>yefhamak<span className="brand-caption">LIVE WORKSPACE</span></span></Link><div className="workspace-label">YOUR BACKEND</div><nav aria-label="Live navigation"><Link href="/demo" onClick={e => { if (busy) e.preventDefault() }} className={`nav-item ${view === 'chat' ? 'active' : ''}`}><MessageCircle size={19} /> Live chat</Link><Link href="/seller/orders" onClick={e => { if (busy) e.preventDefault() }} className={`nav-item ${view === 'orders' ? 'active' : ''}`}><ShoppingBag size={19} /> Seller orders</Link></nav><div className="sidebar-note"><strong>Real backend. Your machine.</strong><p>Live conversations and orders are stored in your configured database.</p><span className="local-dot">{connected ? 'Backend connected' : 'Not connected'}</span></div></aside>
    <main className="demo-main"><header className="demo-topbar"><strong>{view === 'chat' ? 'Live chat' : 'Seller orders'}</strong><span>{connected ? 'Connected' : 'Connect below'} · Backend mode</span></header><div className="demo-content">
      <div className="page-heading"><div><span className="eyebrow">YOUR LOCAL MVP</span><h1>{view === 'chat' ? 'Talk to your real assistant.' : 'Orders from your backend.'}</h1><p>{view === 'chat' ? 'Replies come from the backend agent, never the mock script.' : 'Read-only seller view. No browser-local mock orders are shown here.'}</p></div>{connected && <button className="button secondary" disabled={busy} onClick={view === 'chat' ? newConversation : () => setRefreshVersion(v => v + 1)}>{view === 'chat' ? 'New conversation' : 'Refresh orders'}</button>}</div>
      <section className="live-connection" aria-label="Backend connection"><form onSubmit={connect}><label>Backend URL<input aria-label="Backend URL" type="url" required value={baseUrl} disabled={connected || busy} onChange={e => setBaseUrl(e.target.value)} /></label><label>Local demo API key<input aria-label="Local demo API key" type="password" required autoComplete="off" value={apiKey} disabled={connected || busy} onChange={e => setApiKey(e.target.value)} /></label>{connected ? <button type="button" className="button secondary" onClick={disconnect} disabled={busy}>Disconnect</button> : <button className="button primary" disabled={busy || !apiKey.trim()}>{busy ? 'Connecting…' : 'Connect backend'}</button>}</form><p>Use DEMO_API_KEY, not your OpenRouter key. Kept in tab memory only; re-enter after reload. Enter it only for a backend you trust.</p></section>
      <div className="mock-banner"><MessageCircle size={18} /><div><strong>Live mode</strong><span>{liveEnabled && connected ? 'Sending can use real model quota. No automatic retries.' : 'Connect and browse without model calls. Sending requires LIVE_CHAT_ENABLED=true.'}</span></div></div>
      {error && <div className="demo-error" role="alert">{error}</div>}{notice && <div className="live-notice" role="status">{notice}</div>}
      {!connected ? <div className="empty-orders"><MessageCircle size={32} /><h2>Bring your backend online.</h2><p>Start it on 127.0.0.1:8000, apply migrations, and enter your local demo key. Mock mode remains available above.</p></div> : view === 'chat' ? <div className="chat-grid"><section className="chat-panel"><div className="chat-header"><span className="assistant-avatar"><MessageCircle size={23} /></span><div><h2>Demo Store · backend agent</h2><p>{conversation?.status || 'New conversation'} · {liveEnabled ? 'Live sending enabled' : 'Live sending disabled'}</p></div><button className="button secondary" disabled={busy || !conversation} onClick={refreshHistory}>Refresh history</button></div><div className="chat-messages" role="log" aria-live="polite" aria-label="Live chat messages">{!messages.length && <p className="live-empty-chat">{conversation ? 'No saved messages yet.' : 'Your conversation will be created when you send your first message.'}</p>}{messages.map(m => <div key={m.id} className={`message-row ${m.direction === 'IN' ? 'user' : 'assistant'}`}><div className="message-bubble" dir="auto">{m.body}<span className="message-meta">{m.direction === 'IN' ? 'You' : 'Backend assistant'} <CheckCheck size={12} /></span></div></div>)}{pending && <div className="live-pending"><strong>Pending / uncertain message</strong><p dir="auto">{pending.text}</p><button className="button secondary" disabled={busy || !liveEnabled} onClick={() => send(pending)}>{busy ? 'Waiting for backend…' : 'Check same request safely'}</button><button type="button" className="button secondary" disabled={busy} onClick={leaveUncertainConversation}>Leave this conversation…</button><p>Request ID: {pending.requestId}. Reuses the same ID; never starts a second turn for this request.</p></div>}<div ref={bottom} /></div><div className="chat-composer"><form onSubmit={e => { e.preventDefault(); void send() }}><textarea aria-label="Live message" dir="auto" value={input} maxLength={600} rows={2} placeholder="اكتب رسالتك هنا…" disabled={busy || !liveEnabled || !!pending || conversation?.status === 'CLOSED' || conversation?.status === 'HANDOFF'} onChange={e => setInput(e.target.value)} /><button className="send-button" aria-label="Send live message" disabled={busy || !liveEnabled || !!pending || !input.trim() || conversation?.status === 'CLOSED' || conversation?.status === 'HANDOFF'}><ArrowUp size={20} /></button></form><p className="composer-footnote">Sending uses the real backend. Use sample customer information.</p></div></section><aside className="chat-context"><section className="context-card"><span className="eyebrow">A REAL CONVERSATION</span><h2>From your database.</h2><p className="context-caption">No scripted suggestions or simulated catalog are shown in Live mode. Ask the assistant about products and availability.</p>{conversation && <p className="context-caption live-id">Conversation: {conversation.id}</p>}<Link className="button secondary" href="/seller/orders">Inspect backend orders <ChevronRight size={14} /></Link></section></aside></div> : <>
        <div className="orders-toolbar"><div className="order-tabs" role="group" aria-label="Live order status">{[['', 'All orders'], ['PENDING', 'Pending'], ['CONFIRMED', 'Confirmed'], ['CANCELLED', 'Cancelled']].map(([value, label]) => <button key={value} aria-pressed={filter === value} className={filter === value ? 'selected' : ''} onClick={() => { setFilter(value); setOffset(0) }}>{label}</button>)}</div><label className="order-search"><input aria-label="Search backend orders" maxLength={100} value={query} placeholder="Search customer name or phone" onChange={e => { setQuery(e.target.value); setOffset(0) }} /></label></div><section className="orders-panel">{loading ? <div className="empty-orders" role="status">Loading backend orders…</div> : !orders.items.length ? <div className="empty-orders"><h2>{error ? 'Orders could not be loaded.' : 'No matching backend orders.'}</h2><p>Only orders stored by the backend appear here. Mock orders stay in Mock mode.</p></div> : <div className="order-table-wrap"><table className="order-table"><thead><tr><th>Order</th><th>Customer</th><th>Delivery area</th><th>Total</th><th>Status</th><th>Details</th></tr></thead><tbody>{orders.items.map(o => <tr key={o.id}><td><strong>{o.id.slice(0, 8)}</strong><small>{timestamp(o.created_at)}</small></td><td><strong>{o.customer_name}</strong><small>{o.phone}</small></td><td>{o.area || '—'}</td><td>{money(Number(o.total))}</td><td><span className={`status-pill ${o.status === 'CONFIRMED' ? 'reviewed' : o.status === 'CANCELLED' ? 'cancelled' : ''}`}>{statusLabel(o.status)}</span></td><td><button className="detail-button" disabled={busy} aria-label={`View backend order ${o.id}`} onClick={() => inspectOrder(o.id)}>View <ChevronRight size={14} /></button></td></tr>)}</tbody></table></div>}</section><div className="live-pagination"><span>{orders.total} matching order{orders.total === 1 ? '' : 's'} · {offset + (orders.items.length ? 1 : 0)}–{offset + orders.items.length}</span><button className="button secondary" disabled={loading || offset === 0} onClick={() => setOffset(v => Math.max(0, v - 25))}>Previous</button><button className="button secondary" disabled={loading || offset + orders.limit >= orders.total} onClick={() => setOffset(v => v + 25)}>Next</button></div><p className="orders-note">Read-only backend data. Status updates and database reset are not exposed here.</p>
      </>}
    </div></main>{detail && <LiveOrderDialog order={detail} close={() => setDetail(null)} />}
  </div>
}

function LiveOrderDialog({ order, close }: { order: ApiOrderDetail; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => { dialog.current?.showModal(); return () => dialog.current?.close() }, [])
  return <dialog ref={dialog} className="demo-dialog" aria-label="Backend order details" onCancel={close}><button className="dialog-close" aria-label="Close order details" onClick={close}><X size={18} /></button><span className="eyebrow">BACKEND ORDER · READ ONLY</span><h2>{order.id.slice(0, 8)}</h2><span className="status-pill">{statusLabel(order.status)}</span><section className="detail-section"><h3>Customer & delivery</h3><strong>{order.customer_name}</strong><p>{order.phone}</p><p dir="auto">{order.address}</p><p>{order.area}</p></section><section className="detail-section"><h3>Items</h3>{order.items.map((item, index) => <div className="summary-line" key={`${item.product_code}-${index}`}><span>{item.product_name}<small>{item.color} · {item.size} × {item.quantity} · {money(Number(item.unit_price))} each</small></span><strong>{money(Number(item.unit_price) * item.quantity)}</strong></div>)}<div className="summary-line"><span>Delivery</span><strong>{money(Number(order.delivery_fee))}</strong></div><div className="summary-line grand-total"><strong>Total</strong><strong>{money(Number(order.total))}</strong></div></section><p className="context-caption live-id">Conversation: {order.conversation_id}</p></dialog>
}
