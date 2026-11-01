import test from 'node:test'
import assert from 'node:assert/strict'
import { respond } from '../lib/demo-store.ts'

function advance(...inputs) {
  let result = { chat: { stage: 'browse' } }
  for (const input of inputs) result = respond(result.chat, input)
  return result
}
const details = 'Ahmed Demo\n01000000000\n12 Demo Street, building 4\nCairo'

test('first mention asks for clarification without reserving', () => {
  const result = advance('عايز هودي بني مقاس M')
  assert.equal(result.chat.stage, 'choose')
  assert.equal(result.order, undefined)
})
test('black hoodie asks for confirmation before delivery details', () => {
  const result = advance('عايز هودي اسود')
  assert.equal(result.chat.stage, 'reserve')
  assert.equal(result.chat.product.price, 380)
})
test('order preview includes delivery but creates no order', () => {
  const result = advance('brown hoodie', 'Oversized Hoodie', 'yes', details)
  assert.equal(result.chat.stage, 'confirm')
  assert.match(result.reply, /570/)
  assert.equal(result.order, undefined)
})
test('explicit final confirmation creates one order; repeat does not duplicate', () => {
  const result = advance('brown hoodie', 'Oversized Hoodie', 'yes', details, 'yes')
  assert.equal(result.order.total, 570)
  assert.equal(result.order.status, 'pending')
  assert.equal(result.order.customer, 'Ahmed Demo')
  assert.equal(respond(result.chat, 'yes').order, undefined)
})
test('invalid phone and unsupported delivery area cannot reach confirmation', () => {
  const held = advance('black hoodie', 'yes')
  for (const invalid of [details.replace('01000000000', '123'), details.replace('Cairo', 'Mars')]) {
    assert.equal(respond(held.chat, invalid).chat.stage, 'details')
  }
})
test('Alexandria fee and Arabic digits are handled', () => {
  const result = advance('black hoodie', 'yes', details.replace('01000000000', '٠١٠٠٠٠٠٠٠٠٠').replace('Cairo', 'Alexandria'), 'yes')
  assert.equal(result.order.phone, '01000000000')
  assert.equal(result.order.delivery, 80)
  assert.equal(result.order.total, 460)
})
test('cancellation resets the in-progress selection without an order', () => {
  const result = advance('black hoodie', 'no')
  assert.equal(result.chat.stage, 'browse')
  assert.equal(result.order, undefined)
})
