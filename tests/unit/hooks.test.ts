import Rize from '../../src'

test('call a function before browser launch', async () => {
  expect.assertions(1)
  const fn = jest.fn()
  const instance = new Rize({ beforeLaunch: fn })
  await instance
    .execute(() => {
      expect(fn).toBeCalled()
    })
    .end()
}, process.env.CI ? 8000 : 5000)

test('call a function after browser launched', async () => {
  expect.assertions(4)
  const fn = jest.fn()
  const instance = new Rize({ afterLaunched: fn })
  await instance
    .execute(function () {
      expect(this).toBe(instance)
      expect(this.browser).toBe(instance.browser)
      expect(this.page).toBe(instance.page)
      expect(fn).toBeCalled()
    })
    .end()
})

test('call a function before browser exit', async () => {
  const fn = jest.fn()
  const instance = new Rize({ beforeExit: fn })
  await instance.end()
  expect(fn).toBeCalled()
})
