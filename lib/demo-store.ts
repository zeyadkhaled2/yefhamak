export type Product = { code: string; name: string; color: string; price: number; stock: number }
export type DemoOrder = {
  id: string; createdAt: string; customer: string; phone: string; address: string;
  area: string; product: Product; delivery: number; total: number;
  status: 'pending' | 'reviewed' | 'cancelled'
}
export type Message = { id: string; role: 'assistant' | 'user'; text: string }
export type Chat = { stage: 'browse' | 'choose' | 'reserve' | 'details' | 'confirm' | 'done'; product?: Product; details?: { customer: string; phone: string; address: string; area: string }; order?: DemoOrder }
export const STORAGE_KEY = 'yefhamak.demo.orders.v1'
export const PRODUCTS: Product[] = [
  { code: 'H-014', name: 'Q1 Long Sleeve Hoodie', color: 'brown', price: 450, stock: 3 },
  { code: 'H-022', name: 'Oversized Hoodie', color: 'brown', price: 520, stock: 1 },
  { code: 'H-031', name: 'Basic Black Hoodie', color: 'black', price: 380, stock: 5 },
]
export const money = (value: number) => new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(value)
export const welcome = 'أهلاً بيك في Demo Store 👋 تحب أساعدك تلاقي إيه؟ جرّب تسأل عن هودي بني أو أسود.'
export function readOrders(): DemoOrder[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  const parsed: unknown = JSON.parse(raw)
  if (!Array.isArray(parsed) || parsed.some(o => !o || typeof o.id !== 'string' || !o.product || typeof o.product.price !== 'number' || typeof o.total !== 'number' || typeof o.createdAt !== 'string' || !['pending', 'reviewed', 'cancelled'].includes(o.status))) throw new Error('Saved demo orders could not be read. Reset demo data to start again.')
  return parsed as DemoOrder[]
}
export function saveOrders(orders: DemoOrder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  window.dispatchEvent(new Event('yefhamak-orders'))
}
const normalize = (text: string) => text.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
const yes = (text: string) => /^(ايوه|اه|نعم|تمام|اكيد|اكد|احجز|yes|confirm|reserve|ok)(\s|$)/.test(text)
export function respond(chat: Chat, input: string): { chat: Chat; reply: string; order?: DemoOrder } {
  const text = normalize(input.trim())
  if (/^(لا|الغاء|الغي|cancel|no)(\s|$)/.test(text)) return { chat: { stage: 'browse' }, reply: 'تمام، لغينا الاختيار الحالي. تحب تشوف إيه تاني؟ الطلبات اللي اتأكدت قبل كده بتفضل في شاشة البائع.' }
  if (chat.stage === 'done') return { chat, reply: 'طلبك التجريبي اتسجل بالفعل. افتح شاشة البائع لمراجعته أو اضغط New chat لطلب جديد.' }
  if (chat.stage === 'choose') {
    const product = /h-022|oversized|اوفر/.test(text) ? PRODUCTS[1] : /h-014|q1|classic|كيو|كلاسيك/.test(text) ? PRODUCTS[0] : undefined
    if (!product) return { chat, reply: 'تقصد Q1 Long Sleeve Hoodie ولا Oversized Hoodie؟ اكتب اسم واحد منهم.' }
    return { chat: { stage: 'reserve', product }, reply: `${product.name} بني مقاس M، قطعة واحدة بـ ${product.price} جنيه. تحب أحجزهولك تجريبياً؟ اكتب ايوه أو لا.` }
  }
  if (chat.stage === 'reserve' && chat.product) {
    if (!yes(text)) return { chat, reply: 'للتأكيد اكتب ايوه، أو لا للإلغاء. الحجز هنا محاكاة محلية فقط.' }
    return { chat: { ...chat, stage: 'details' }, reply: 'تم الحجز التجريبي. ابعت الاسم، رقم موبايل مصري، عنوان مفصل، والمدينة في 4 سطور. المدن المتاحة: Cairo / Giza / Alexandria.' }
  }
  if (chat.stage === 'details' && chat.product) {
    const parts = input.split(/\n|\|/).map(s => s.trim()).filter(Boolean)
    if (parts.length !== 4) return { chat, reply: 'ابعت البيانات في 4 سطور: الاسم، الموبايل، العنوان، المدينة. ممكن تستخدم زر Use sample details ببيانات تجريبية.' }
    const [customer, rawPhone, address, areaText] = parts
    const phone = normalize(rawPhone).replace(/[\s()-]/g, '')
    const area = /^(cairo|القاهرة|القاهره)$/i.test(areaText) ? 'Cairo' : /^(giza|الجيزة|الجيزه)$/i.test(areaText) ? 'Giza' : /^(alexandria|الاسكندرية|الاسكندريه)$/i.test(normalize(areaText)) ? 'Alexandria' : ''
    if (customer.length < 2 || !/^01[0125]\d{8}$/.test(phone) || address.length < 10 || !area) return { chat, reply: 'راجع البيانات: اسم واضح، موبايل مصري 11 رقم، عنوان مفصل (10 حروف على الأقل)، ومدينة Cairo أو Giza أو Alexandria.' }
    const delivery = area === 'Alexandria' ? 80 : 50
    return { chat: { ...chat, stage: 'confirm', details: { customer, phone, address, area } }, reply: `راجع الطلب التجريبي:\n${chat.product.name} · ${chat.product.color} · M × 1\n${customer}\n${phone}\n${address}، ${area}\nالمنتج: ${chat.product.price} جنيه\nالتوصيل: ${delivery} جنيه\nالإجمالي: ${chat.product.price + delivery} جنيه\nتأكد الطلب؟ اكتب ايوه أو لا.` }
  }
  if (chat.stage === 'confirm' && chat.product && chat.details) {
    if (!yes(text)) return { chat, reply: 'اكتب ايوه لتأكيد الطلب التجريبي، أو لا للإلغاء.' }
    const delivery = chat.details.area === 'Alexandria' ? 80 : 50
    const order: DemoOrder = { id: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, createdAt: new Date().toISOString(), ...chat.details, product: chat.product, delivery, total: chat.product.price + delivery, status: 'pending' }
    return { chat: { ...chat, stage: 'done', order }, order, reply: `اتسجل طلبك التجريبي ${order.id} ✅ الإجمالي ${order.total} جنيه. تقدر تشوفه في Seller orders. مفيش دفع أو شحن حقيقي.` }
  }
  if (/اسود|aswad|black|h-031/.test(text)) return { chat: { stage: 'reserve', product: PRODUCTS[2] }, reply: 'Basic Black Hoodie أسود مقاس M بـ 380 جنيه، قطعة واحدة. تحب أحجزهولك تجريبياً؟ اكتب ايوه أو لا.' }
  if (/بني|brown|bony|boni|hoodie|هودي|hodi/.test(text)) return { chat: { stage: 'choose' }, reply: 'عندنا اختيارين بني مقاس M:\nQ1 Long Sleeve Hoodie — 450 جنيه\nOversized Hoodie — 520 جنيه\nأنهي واحد تقصد؟' }
  return { chat, reply: 'دي محاكاة محدودة لطلب هودي. جرّب: «عايز هودي بني مقاس M» أو «عايز هودي اسود». الردود مكتوبة مسبقاً، مش من نموذج ذكاء اصطناعي.' }
}

