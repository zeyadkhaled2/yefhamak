import type { LucideIcon } from 'lucide-react'
import { CircleCheck, MessageCircle, PackageCheck, Phone } from 'lucide-react'

export type Language = 'ar' | 'en'
export type Dictionary = typeof copy.ar

const copy = {
  ar: {
    nav: ['المميزات', 'إزاي بيشتغل', 'الأسعار', 'الأسئلة الشائعة'], waitlist: 'انضم لقائمة الانتظار', heroEyebrow: 'مساعد مبيعاتك اللي مش بينام', heroTitle: 'مفيش سؤال هيبات', heroText: 'يفهمك بيرد على عملاءك على واتساب بالمصري، ياخد الطلبات، ويبعتها لك 24/7 — حتى وإنت نايم.', whatsapp: 'كلمنا على واتساب', problemEyebrow: 'الرسائل مش بتخلص', problemTitle: 'كل رسالة ضاعت، فرصة ضاعت', problems: ['العملاء بيبعتوا بالليل ومحدش بيرد', 'بتجاوب نفس الأسئلة 50 مرة في اليوم', 'الطلبات بتضيع وسط الشات الطويل'], featureEyebrow: 'مبني عشان يفهمك', featureTitle: 'مش مجرد رد آلي', features: [['يفهم المصري والفرانكو', 'يتعامل مع طريقة كلام عملاءك الطبيعية، من غير ما تحس إنك بتكلم روبوت.', MessageCircle], ['عارف منتجاتك بجد', 'أسعارك، مقاساتك، والمخزون الحالي — كل حاجة قدامه عشان يدي إجابة مظبوطة.', PackageCheck], ['يلمّ الطلب كامل', 'الاسم، العنوان، ورقم التليفون في خطوات بسيطة ومن غير لف كتير.', Phone], ['يسيبك تتدخل وقت اللزوم', 'لو مش متأكد، يحول المحادثة لك بدل ما يخمّن أو يضيّع عميل.', CircleCheck]], howEyebrow: 'تبدأ في 3 خطوات', howTitle: 'سيب الشغل التقيل علينا', steps: [['وصّل صفحتك', 'اربط رقم واتساب أو صفحة واتساب بتاعتك.'], ['ضيف منتجاتك', 'ارفع منتجاتك في شيت بسيطة — من غير إعدادات معقدة.'], ['اتفرج على الطلبات', 'ابدأ تستقبل طلبات حتى وإنت نايم.']], pricingEyebrow: 'خطط واضحة', pricingTitle: 'نحدد المناسب بعد ما نفهم احتياجك', pricingText: 'الأسعار المقترحة تعتمد على حجم الرسائل، عدد الردود، وطريقة التشغيل. نتكلم معاك الأول ونوضح كل الحدود والتكاليف قبل البدء — من غير وعود غير واضحة.', starter: 'البداية', growth: 'النمو', from: 'ابتداءً من', month: 'جنيه / شهر', talk: 'احجز تجربة', ctaTitle: 'جاهز تبعد عن الرسائل اللي مبتخلصش؟', ctaText: 'سيب بياناتك وهنكلمك أول ما نفتح التسجيل.', phonePlaceholder: 'إيميل أو رقم موبايل', faqEyebrow: 'أسئلة بتتكرر', faqTitle: 'عايز تعرف أكتر؟', faqs: [['هل بيشتغل على واتساب؟', 'أيوه، يفهمك بيتعامل مع محادثات واتساب ويخلي التجربة طبيعية لعملاءك.'], ['العميل هيعرف إنه بيكلم بوت؟', 'إحنا بنصمم التجربة إنها تكون طبيعية وواضحة. ولو العميل طلبك، تقدر تستلم المحادثة في أي وقت.'], ['أقدر أعدّل منتجاتي بنفسي؟', 'طبعًا. تحدّث المنتجات والأسعار والمخزون من شيت بسيطة في أي وقت.'], ['إيه اللي بيحصل لو مش عارف الإجابة؟', 'مش بيخمن. بيحوّل المحادثة لك فورًا عشان ترد بنفسك.']], footer: 'مساعد مبيعاتك اللي بيفهمك وبيفهم عملاءك.', copyright: '© 2025 يفهمك. كل الحقوق محفوظة.'
  },
  en: {
    nav: ['Features', 'How it works', 'Pricing', 'FAQ'], waitlist: 'Join the waitlist', heroEyebrow: 'Your sales assistant that never sleeps', heroTitle: 'Every question answered, even at 2 AM.', heroText: 'Yefhamak replies to customers on WhatsApp in Egyptian Arabic, takes their orders, and sends them to you 24/7.', whatsapp: 'Chat with us on WhatsApp', problemEyebrow: 'The messages never stop', problemTitle: 'Every missed message is a missed opportunity', problems: ['Customers message at night and get no reply', 'You answer the same questions 50 times a day', 'Orders get lost in long chats'], featureEyebrow: 'Built to understand', featureTitle: 'More than an auto-reply', features: [['Understands Egyptian Arabic & Franco', 'It speaks like your customers do, naturally and without sounding robotic.', MessageCircle], ['Knows your real products', 'Prices, sizes, and live stock — so every answer is accurate.', PackageCheck], ['Collects complete orders', 'Name, address, and phone in a few simple steps.', Phone], ['Hands off when unsure', 'When it is not certain, it brings you into the conversation.', CircleCheck]], howEyebrow: 'Start in 3 steps', howTitle: 'Leave the heavy lifting to us', steps: [['Connect your page', 'Link your WhatsApp number or Instagram page.'], ['Add your products', 'Upload them in a simple sheet — no complex setup.'], ['Watch orders arrive', 'Start receiving orders while you sleep.']], pricingEyebrow: 'Clear plans', pricingTitle: 'We recommend the right fit after learning your needs', pricingText: 'Plans depend on message volume, reply limits, and how your business operates. We will explain the scope and costs before you start — no vague promises or “unlimited” claims.', starter: 'Starter', growth: 'Growth', from: 'From', month: 'EGP / month', talk: 'Book a trial', ctaTitle: 'Ready to stop drowning in messages?', ctaText: 'Leave your details and we will reach out when sign-ups open.', phonePlaceholder: 'Email or phone number', faqEyebrow: 'Frequently asked', faqTitle: 'Want to know more?', faqs: [['Does it work with WhatsApp?', 'Yes. Yefhamak works across both channels while keeping the experience natural for your customers.'], ['Will customers know it is a bot?', 'The experience feels natural and clear. You can take over any conversation whenever needed.'], ['Can I update products myself?', 'Yes. Update products, prices, and stock from a simple sheet anytime.'], ['What happens when it does not know?', 'It never guesses. It hands the conversation to you so you can reply yourself.']], footer: 'A sales assistant that understands you and your customers.', copyright: '© 2025 Yefhamak. All rights reserved.'
  }
} satisfies Record<Language, { features: [string, string, LucideIcon][]; [key: string]: unknown }>

export { copy }

export const businessPlan = {
  ar: {
    plans: [
      { name: 'البداية', price: '999', replies: 'حتى 1,000 رد AI شهريًا', surplus: '217', features: ['رقم واتساب واحد', 'إعداد مُدار', 'أسئلة العملاء المعتادة', 'سجل محادثات أساسي', 'تحويل المحادثة لك'] },
      { name: 'النمو', price: '1,999', replies: 'حتى 3,000 رد AI شهريًا', surplus: '927', features: ['كل مميزات البداية', 'قاعدة معرفة أكبر', 'تقارير استخدام', 'دعم موسّع'] },
      { name: 'المحترف', price: '3,999', replies: 'حتى 8,000 رد AI شهريًا', surplus: '2,367', features: ['كل مميزات النمو', 'تحكم متقدم في سير العمل', 'تقارير أكثر تفصيلًا', 'دعم بأولوية'] },
    ],
    note: 'أسعار الإطلاق لا تزال قيد الاختبار وليست سعرًا سوقيًا مُثبتًا.',
    integrity: 'رسوم واتساب وMeta منفصلة. الأرقام تقديرية ولا تشمل التسويق أو الضرائب أو التسجيل أو الدعم الإضافي.',
    unit: 'جنيه / شهر', surplusLabel: 'فائض تشغيلي تقديري', included: 'يشمل', replyLabel: 'الحد الشهري'
  },
  en: {
    plans: [
      { name: 'Starter', price: '999', replies: 'Up to 1,000 AI replies / month', surplus: '217', features: ['One connected WhatsApp number', 'Managed setup', 'Routine customer questions', 'Basic conversation history', 'Human handover'] },
      { name: 'Growth', price: '1,999', replies: 'Up to 3,000 AI replies / month', surplus: '927', features: ['Everything in Starter', 'Larger knowledge base', 'Usage reporting', 'Higher support allowance'] },
      { name: 'Pro', price: '3,999', replies: 'Up to 8,000 AI replies / month', surplus: '2,367', features: ['Everything in Growth', 'Advanced workflow controls', 'Detailed reporting', 'Priority support'] },
    ],
    note: 'Launch prices are hypotheses to test with customers, not validated market prices.',
    trial: 'Founding customer trial', trialText: '14 days capped at 500 AI replies per shop. Reassess pricing after the first 3 shops.',
    integrity: 'WhatsApp/Meta charges are separate. Estimates exclude marketing, tax, registration, and support beyond the allowance.',
    unit: 'EGP / month', surplusLabel: 'Estimated operating surplus', included: 'Includes', replyLabel: 'Monthly limit'
  }
} as const

export function getDictionary(language: Language) { return copy[language] }
