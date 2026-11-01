export type Connection = { baseUrl: string; apiKey: string }
export type ApiMessage = { id: string; direction: 'IN' | 'OUT'; body: string; created_at: string }
export type ApiConversation = { id: string; status: 'BOT' | 'HANDOFF' | 'CLOSED'; created_at: string }
export type SendResult = { request_id: string; conversation_id: string; status: ApiConversation['status']; reply: string | null; outcome: 'reply' | 'handoff' | 'provider_error' | 'application_error'; rate_limited: boolean }
export type ApiOrder = { id: string; conversation_id: string; status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'; customer_name: string; phone: string; address: string; area: string | null; delivery_fee: string; total: string; created_at: string }
export type ApiOrderDetail = ApiOrder & { items: { product_name: string; product_code: string; color: string; size: string; quantity: number; unit_price: string }[] }
export type OrderPage = { items: ApiOrder[]; total: number; limit: number; offset: number }
export type PendingMessage = { conversationId: string; requestId: string; text: string }

// Deliberately memory-only: no key in localStorage, sessionStorage, or public env vars.
let connection: Connection = { baseUrl: 'http://127.0.0.1:8000', apiKey: '' }
export const getConnection = () => ({ ...connection })
export function setConnection(value: Connection) { connection = { baseUrl: normalizeBaseUrl(value.baseUrl), apiKey: value.apiKey.trim() } }
export function clearConnection() { connection = { ...connection, apiKey: '' } }
export function normalizeBaseUrl(input: string) {
  const url = new URL(input.trim())
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  if (url.username || url.password || url.search || url.hash || (url.pathname !== '/' && url.pathname !== '') || (url.protocol !== 'https:' && !(url.protocol === 'http:' && local))) throw new Error('Use an HTTPS backend origin, or HTTP on localhost/127.0.0.1. Do not include a path or credentials.')
  return url.origin
}
const explanations: Record<string, string> = {
  invalid_demo_api_key: 'The demo API key was rejected. Check the key in your backend .env.',
  demo_api_key_not_configured: 'Set DEMO_API_KEY in the backend .env and restart the backend.',
  demo_store_not_seeded: 'The Demo Store is missing. See the backend setup docs before seeding; seeding deletes demo data.',
  live_chat_disabled: 'Connected, but live sending is disabled. Enable LIVE_CHAT_ENABLED only when you intend to use model quota.',
  conversation_not_found: 'This conversation no longer exists. Start a new conversation.',
  conversation_closed: 'This conversation is closed. Start a new conversation.',
  conversation_busy: 'Another request is active for this conversation. Wait, then check the same request again.',
  request_in_progress: 'This request is still running or was interrupted. Refresh history and orders; do not submit it with a new ID.',
  request_id_reused: 'This request ID belongs to different content. Check conversation history before continuing.',
}
export class ApiError extends Error {
  status: number
  code: string
  constructor(status: number, code: string) { super(explanations[code] || `Backend returned ${status}. Check the local backend and its migrations.`); this.status = status; this.code = code }
}
export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!connection.apiKey) throw new Error('Enter your local demo API key and connect first.')
  let response: Response
  try {
    response = await fetch(`${connection.baseUrl}${path}`, { ...init, cache: 'no-store', credentials: 'omit',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${connection.apiKey}`, ...init.headers } })
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error
    throw new Error('Cannot reach the backend. Start it locally and check the URL/CORS. On Vercel, your browser may block access to localhost; use the local frontend in that case.')
  }
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(response.status, typeof body?.detail === 'string' ? body.detail : 'request_failed')
  if (body === null) throw new Error('The backend returned an invalid response.')
  return body as T
}
export const api = {
  status: (signal?: AbortSignal) => request<{ store: string; live_chat_enabled: boolean }>('/api/demo/status', { signal }),
  createConversation: () => request<ApiConversation>('/api/demo/conversations', { method: 'POST' }),
  conversation: (id: string, signal?: AbortSignal) => request<ApiConversation>(`/api/demo/conversations/${encodeURIComponent(id)}`, { signal }),
  async history(id: string, signal?: AbortSignal): Promise<ApiMessage[]> {
    const items: ApiMessage[] = []
    for (let offset = 0; ; offset += 100) {
      const page = await request<{ items: ApiMessage[] }>(`/api/demo/conversations/${encodeURIComponent(id)}/messages?limit=100&offset=${offset}`, { signal })
      items.push(...page.items)
      if (page.items.length < 100) return items
    }
  },
  send: (pending: PendingMessage) => request<SendResult>(`/api/demo/conversations/${encodeURIComponent(pending.conversationId)}/messages`, {
    method: 'POST', body: JSON.stringify({ request_id: pending.requestId, text: pending.text }),
  }),
  orders: (status: string, query: string, offset: number, signal?: AbortSignal) => {
    const params = new URLSearchParams({ limit: '25', offset: String(offset) })
    if (status) params.set('status', status)
    if (query.trim()) params.set('q', query.trim())
    return request<OrderPage>(`/api/demo/orders?${params}`, { signal })
  },
  order: (id: string, signal?: AbortSignal) => request<ApiOrderDetail>(`/api/demo/orders/${encodeURIComponent(id)}`, { signal }),
}

// Scope conversation and pending-message state by backend origin. No credentials here.
const stateKey = () => `yefhamak.live.${connection.baseUrl}`
export function readSession(): { conversationId: string | null; pending: PendingMessage | null } {
  const value = JSON.parse(sessionStorage.getItem(stateKey()) || '{}')
  return { conversationId: typeof value.conversationId === 'string' ? value.conversationId : null,
    pending: value.pending && typeof value.pending.requestId === 'string' && typeof value.pending.text === 'string' && typeof value.pending.conversationId === 'string' ? value.pending : null }
}
export function saveSession(conversationId: string | null, pending: PendingMessage | null) {
  sessionStorage.setItem(stateKey(), JSON.stringify({ conversationId, pending }))
}
