import Rize from '../../src'

test('call a function before browser launch', done => {
  expect.assertions(1)
  const fn = jest.fn()
  const instance = new Rize({ beforeLaunch: fn })
  instance
    .execute(() => {
      expect(fn).toBeCalled()
    })
    .end(done)
}, process.env.CI ? 8000 : 5000)

test('call a function after browser launched', done => {
  expect.assertions(4)
  const fn = jest.fn()
  const instance = new Rize({ afterLaunched: fn })
  instance
    .execute(function () {
      expect(this).toBe(instance)
      expect(this.browser).toBe(instance.browser)
      expect(this.page).toBe(instance.page)
      expect(fn).toBeCalled()
    })
    .end(done)
})

test('call a function before browser exit', async () => {
  const fn = jest.fn()
  const instance = new Rize({ beforeExit: fn })
  await instance.end()
  expect(fn).toBeCalled()
})
