import { AssertionError } from 'assert'
import * as error from '../../../src/utils/error'

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
    error.throwAssertionError(new AssertionError({}))
  }).toThrow(AssertionError)

  expect(() => {
    error.throwAssertionError(new Error())
  }).not.toThrow()
})
