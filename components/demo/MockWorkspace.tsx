'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUp, Check, CheckCheck, ChevronRight, FlaskConical, MessageCircle, Package, Search, ShoppingBag, X } from 'lucide-react'
import { money, PRODUCTS, readOrders, respond, saveOrders, STORAGE_KEY, welcome, type Chat, type DemoOrder, type Message } from '@/lib/demo-store'
import './demo.css'

const message = (role: Message['role'], text: string): Message => ({ id: crypto.randomUUID(), role, text })
const sample = 'Ahmed Demo\n01000000000\n12 Demo Street, building 4\nCairo'
const date = (value: string) => new Date(value).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export default function MockWorkspace({ view }: { view: 'chat' | 'orders' }) {
  const [orders, setOrders] = useState<DemoOrder[]>([])
  const [messages, setMessages] = useState<Message[]>([{ id: 'welcome', role: 'assistant', text: welcome }])
  const [chat, setChat] = useState<Chat>({ stage: 'browse' })
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [resetOpen, setResetOpen] = useState(false)
  const bottom = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sending = useRef(false)

  useEffect(() => {
    const load = () => { try { setOrders(readOrders()); setError(''); setReady(true) } catch (e) { setError(e instanceof Error ? e.message : 'Browser storage is unavailable.'); setReady(true) } }
    load()
    const sync = (event: StorageEvent) => { if (event.key === STORAGE_KEY || event.key === null) load() }
    window.addEventListener('storage', sync)
    window.addEventListener('yefhamak-orders', load)
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('yefhamak-orders', load); if (timer.current) clearTimeout(timer.current) }
  }, [])
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }, [messages, busy])

  function newChat() {
    if (sending.current) return
    setChat({ stage: 'browse' }); setMessages([{ id: 'welcome', role: 'assistant', text: welcome }]); setInput('')
  }
  function send(text: string) {
    if (!text.trim() || sending.current || !ready) return
    sending.current = true; setBusy(true); setInput(''); setError('')
    setMessages(previous => [...previous, message('user', text.trim())])
    timer.current = setTimeout(() => {
      try {
        const result = respond(chat, text)
        if (result.order) saveOrders([result.order, ...readOrders()])
        setChat(result.chat)
        setMessages(previous => [...previous, message('assistant', result.reply)])
      } catch {
        setError('Could not save this demo order. Allow browser storage, then send “ايوه” again. Your order has not been confirmed.')
      } finally { sending.current = false; setBusy(false) }
    }, 450)
  }
  function submit(event: FormEvent) { event.preventDefault(); send(input) }
  function updateStatus(id: string, status: DemoOrder['status']) {
    try { saveOrders(readOrders().map(o => o.id === id ? { ...o, status } : o)); setError('') } catch { setError('Could not update the order. Check browser storage permissions.') }
  }
  function reset() {
    try { saveOrders([]); newChat(); setSelected(null); setResetOpen(false); setError('') } catch { setError('Could not reset browser storage.') }
  }
  const filtered = orders.filter(o => (filter === 'all' || o.status === filter) && `${o.id} ${o.customer} ${o.phone}`.toLowerCase().includes(query.toLowerCase()))
  const detail = orders.find(o => o.id === selected)
  const pending = orders.filter(o => o.status === 'pending').length
  const value = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0)

  return <div className="demo-app" dir="ltr" lang="en">
    <aside className="demo-sidebar">
      <Link href="/" className="demo-brand"><img src="/yefhamak-logo.png" alt="" className="brand-logo" /><span>yefhamak<span className="brand-caption">DEMO WORKSPACE</span></span></Link>
      <div className="workspace-label">YOUR WORKSPACE</div>
      <nav aria-label="Demo navigation">
        <Link href="/demo" className={view === 'chat' ? 'nav-item active' : 'nav-item'}><MessageCircle size={19} /> Demo chat</Link>
        <Link href="/seller/orders" className={view === 'orders' ? 'nav-item active' : 'nav-item'}><ShoppingBag size={19} /> Seller orders</Link>
      </nav>
      <div className="sidebar-note"><span className="note-icon"><FlaskConical size={20} /></span><strong>A little shop. A full journey.</strong><p>Try a conversation, confirm an order, then see the seller’s side.</p><span className="local-dot">Local demo · no API calls</span></div>
    </aside>

    <main className="demo-main">
      <header className="demo-topbar"><strong>{view === 'chat' ? 'Demo chat' : 'Seller orders'}</strong><span>Demo Store · Mock mode</span></header>
      <div className="demo-content">
        <div className="page-heading"><div><span className="eyebrow">{view === 'chat' ? 'FROM FIRST HELLO TO CONFIRMED ORDER' : 'THE OTHER SIDE OF THE CONVERSATION'}</span><h1>{view === 'chat' ? 'Meet your shop assistant.' : 'Your orders, in one place.'}</h1><p>{view === 'chat' ? 'Walk through a shopping conversation, at your own pace.' : 'Review the orders created in your demo conversations.'}</p></div><button className="button secondary" disabled={busy || !ready} onClick={view === 'chat' ? newChat : () => setResetOpen(true)}>{view === 'chat' ? 'New conversation' : 'Reset demo'}</button></div>
        <section className="live-connection mock-controls" aria-label="Mock workspace controls">
          <strong>{view === 'chat' ? 'Suggested messages' : 'Local demo orders'}</strong>
          {view === 'chat' && (<div className="quick-prompts">{chat.stage === 'browse' ? <><button disabled={busy || !ready} onClick={() => send('عايز هودي بني مقاس M')}>هودي بني مقاس M</button><button disabled={busy || !ready} onClick={() => send('عايز هودي اسود')}>هودي أسود</button></> : chat.stage === 'choose' ? <><button disabled={busy} onClick={() => send('Q1 Long Sleeve Hoodie')}>Q1 Long Sleeve Hoodie</button><button disabled={busy} onClick={() => send('Oversized Hoodie')}>Oversized Hoodie</button></> : chat.stage === 'details' ? <button disabled={busy} onClick={() => setInput(sample)}>Use sample details</button> : ['reserve', 'confirm'].includes(chat.stage) ? <><button disabled={busy} onClick={() => send('ايوه')}>ايوه، أكد</button><button disabled={busy} onClick={() => send('لا')}>إلغاء</button></> : <Link href="/seller/orders">View order in seller screen →</Link>}</div>)}
          <p>{view === 'chat' ? 'Pick a suggestion or write your own message below.' : 'Orders created in Mock mode are saved in this browser.'}</p>
        </section>
        <div className="mock-banner"><FlaskConical size={18} /><div><strong>Mock mode</strong><span>Scripted replies · simulated inventory · browser-only orders. No LLM, payment, or shipping.</span></div></div>
        {error && <div className="demo-error" role="alert">{error}<button onClick={() => setResetOpen(true)}>Reset demo data</button></div>}

        {view === 'chat' ? <div className="chat-grid">
          <section className="chat-panel" aria-label="Shopping conversation">
            <div className="chat-header"><span className="assistant-avatar"><MessageCircle size={23} /></span><div><h2>Demo Store assistant</h2><p><span className="status-dot" /> Scripted demo · Egyptian Arabic</p></div><span className="conversation-tag">CUSTOMER VIEW</span></div>
            <div className="chat-messages" role="log" aria-live="polite" aria-label="Chat messages">{messages.map(m => <div key={m.id} className={`message-row ${m.role}`}><div className="message-bubble" dir="auto">{m.text}<span className="message-meta">{m.role === 'assistant' ? 'Demo assistant' : 'You'} {m.role === 'user' && <CheckCheck size={12} />}</span></div></div>)}{busy && <div className="typing" role="status">Preparing demo reply<span>•••</span></div>}<div ref={bottom} /></div>
            <div className="chat-composer">
              <form onSubmit={submit}><textarea aria-label="Your message" placeholder="اكتب رسالتك هنا…" dir="auto" value={input} maxLength={600} rows={2} disabled={busy || !ready} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(input) } }} /><button className="send-button" type="submit" aria-label="Send message" disabled={!input.trim() || busy || !ready}><ArrowUp size={20} /></button></form><p className="composer-footnote">Enter to send · Shift+Enter for a new line</p>
            </div>
          </section>
          <aside className="chat-context"><section className="context-card"><span className="eyebrow">TRY THE WHOLE JOURNEY</span><h2>One chat. One happy ending.</h2><ol className="journey">{['Find your hoodie', 'Confirm the reservation', 'Add delivery details', 'Confirm your order'].map((label, index) => { const progress = ({ browse: 0, choose: 0, reserve: 1, details: 2, confirm: 3, done: 4 })[chat.stage]; return <li key={label} className={index < progress ? 'complete' : index === progress ? 'current' : ''}><span>{index < progress ? <Check size={13} /> : index + 1}</span>{label}</li> })}</ol><p className="context-caption">Confirming creates a local order in the seller view. Nothing leaves this browser.</p></section><section className="context-card catalog"><span className="eyebrow">ON THE DEMO RACK</span>{PRODUCTS.map(p => <div className="catalog-item" key={p.code}><span className={`product-swatch ${p.color}`}><ShoppingBag size={22} /></span><div><strong>{p.name}</strong><p>{p.color} · Size M · {p.code}</p></div><span>{money(p.price)}</span></div>)}<p className="context-caption">Illustrative fixtures for this UI. Stock and reservations are simulated, not connected to the database.</p></section><Link className="seller-shortcut" href="/seller/orders"><ShoppingBag size={21} /><div><strong>Switch to the seller’s side</strong><span>{orders.length} local demo order{orders.length === 1 ? '' : 's'}</span></div><ChevronRight size={17} /></Link></aside>
        </div> : <>
          <div className="orders-toolbar"><div className="order-tabs" role="group" aria-label="Filter order status">{['all', 'pending', 'reviewed', 'cancelled'].map(status => <button key={status} aria-pressed={filter === status} className={filter === status ? 'selected' : ''} onClick={() => setFilter(status)}>{status === 'all' ? 'All orders' : status === 'pending' ? 'Pending' : status === 'reviewed' ? 'Reviewed' : 'Cancelled'}</button>)}</div><label className="order-search"><Search size={17} /><input aria-label="Search orders" placeholder="Search name, phone, or order…" value={query} onChange={e => setQuery(e.target.value)} /></label></div><section className="orders-panel">
            {!ready ? <div className="empty-orders" role="status">Loading local orders…</div> : filtered.length === 0 ? <div className="empty-orders"><span><Package size={30} /></span><h2>{orders.length ? 'No matching orders.' : 'Your first order starts with a hello.'}</h2><p>{orders.length ? 'Try another search or status filter.' : 'Confirm an order in the demo chat. It will appear here, ready for review.'}</p>{orders.length ? <button className="button secondary" onClick={() => { setQuery(''); setFilter('all') }}>Clear filters</button> : <Link className="button primary" href="/demo">Try the demo chat <ChevronRight size={16} /></Link>}</div> : <div className="order-table-wrap"><table className="order-table"><thead><tr><th>Order</th><th>Customer</th><th>Item</th><th>Total</th><th>Status</th><th><span className="sr-only">Details</span></th></tr></thead><tbody>{filtered.map(o => <tr key={o.id}><td><strong>{o.id}</strong><small>{date(o.createdAt)}</small></td><td><strong>{o.customer}</strong><small>{o.area}</small></td><td>{o.product.name}<small>{o.product.color} · M × 1</small></td><td className="order-total">{money(o.total)}</td><td><span className={`status-pill ${o.status}`}>{o.status === 'pending' ? 'Pending review' : o.status === 'reviewed' ? 'Reviewed' : 'Cancelled'}</span></td><td><button className="detail-button" onClick={() => setSelected(o.id)} aria-label={`View ${o.id}`}>View <ChevronRight size={14} /></button></td></tr>)}</tbody></table></div>}
          </section><div className="order-stats"><div><span>Total orders</span><strong>{ready ? orders.length : '—'}</strong><p>Created in this browser</p></div><div><span>Awaiting review</span><strong>{ready ? pending : '—'}</strong><p>Ready for a closer look</p></div><div><span>Active order value</span><strong>{ready ? money(value) : '—'}</strong><p>Excludes cancelled · includes delivery</p></div></div><p className="orders-note">Demo orders stay in this browser and sync between tabs on the same origin. They are not real customer orders.</p>
        </>}
        <footer className="demo-footer"><span>Built for conversations that go somewhere.</span><span>Yefhamak · MVP workspace</span></footer>
      </div>
    </main>
    {detail && <div className="modal-backdrop" onClick={() => setSelected(null)}><OrderDialog order={detail} close={() => setSelected(null)} update={status => updateStatus(detail.id, status)} /></div>}
    {resetOpen && <div className="modal-backdrop"><ResetDialog close={() => setResetOpen(false)} reset={reset} busy={busy} /></div>}
  </div>
}

function Dialog({ label, close, children }: { label: string; close: () => void; children: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => { const element = dialog.current; element?.showModal(); return () => element?.close() }, [])
  return <dialog ref={dialog} className="demo-dialog" aria-label={label} onCancel={close} onClick={e => e.stopPropagation()}><button className="dialog-close" aria-label="Close dialog" onClick={close}><X size={20} /></button>{children}</dialog>
}
function OrderDialog({ order: o, close, update }: { order: DemoOrder; close: () => void; update: (status: DemoOrder['status']) => void }) {
  return <Dialog label={`Order ${o.id}`} close={close}><span className="eyebrow">LOCAL DEMO ORDER</span><h2>{o.id}</h2><span className={`status-pill ${o.status}`}>{o.status}</span><p className="detail-date">{date(o.createdAt)}</p><section className="detail-section"><h3>Customer & delivery</h3><strong>{o.customer}</strong><p dir="auto">{o.phone}</p><p dir="auto">{o.address}</p><p>{o.area}</p></section><section className="detail-section"><h3>Order summary</h3><div className="summary-line"><span>{o.product.name}<small>{o.product.color} · M × 1 · {o.product.code}</small></span><strong>{money(o.product.price)}</strong></div><div className="summary-line"><span>Delivery</span><span>{money(o.delivery)}</span></div><div className="summary-line grand-total"><strong>Total</strong><strong>{money(o.total)}</strong></div></section><div className="dialog-actions">{o.status === 'pending' && <button className="button primary" onClick={() => update('reviewed')}><Check size={16} /> Mark reviewed</button>}{o.status !== 'cancelled' && <button className="button secondary" onClick={() => update('cancelled')}>Cancel demo order</button>}</div><p className="context-caption">Status changes affect only this local demo. No notifications are sent.</p></Dialog>
}
function ResetDialog({ close, reset, busy }: { close: () => void; reset: () => void; busy: boolean }) {
  return <Dialog label="Reset demo data" close={close}><span className="eyebrow">START FRESH</span><h2>Reset local demo data?</h2><p>This deletes demo orders from this browser and starts a new conversation on this screen. Your backend database is unaffected.</p><div className="dialog-actions"><button className="button secondary" onClick={close}>Keep data</button><button className="button danger" disabled={busy} onClick={reset}>Reset demo</button></div></Dialog>
}
