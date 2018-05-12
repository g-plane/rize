import { AssertionError } from 'assert'
import * as error from 'rize/utils/error'

test('beautify error stack', () => {
  const fake = new Error()
  const real = new Error()

  fake.stack = [1, 2, 3, 4, 5].join('\n')
  real.message = 'real'

  const beautified = error.beautifyStack(fake, real)
  expect(beautified).toBe(real)
  expect(real.message).toBe('real')
  expect(real.stack).toBe('real\n4\n5')
})

test('throw assertion error', () => {
  expect(() => {
    const e = new Error()
    e.stack = e.stack!.replace(/rize/g, '')
    error.throwError(e)
  }).not.toThrow()

  expect(() => {
    error.throwError(new AssertionError())
  }).toThrow()

  expect(() => {
    const e = new Error()
    e.stack = 'from rize'
    error.throwError(e)
  }).toThrow()
})
