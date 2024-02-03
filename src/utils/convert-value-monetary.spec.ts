import { convertValueMonetary } from './convert-value-monetary'

test('test function convert value monetary', () => {
  expect(convertValueMonetary(100.741)).toBe(100.74)
  expect(convertValueMonetary(47.117925)).toBe(47.12)
  expect(convertValueMonetary(7493.5421)).toBe(7493.54)
  expect(convertValueMonetary(64.535)).toBe(64.53)
})
