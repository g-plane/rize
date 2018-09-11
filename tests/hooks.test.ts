import Rize from 'rize'

test('call a function before browser launch', async () => {
  expect.assertions(1)
  const fn = jest.fn()
  const instance = new Rize({ beforeLaunch: fn })
  await instance
    .execute(() => {
      expect(fn).toHaveBeenCalledTimes(1)
    })
    .end()
}, process.env.CI ? 8000 : 5000)

test('call a function after browser launched', async () => {
  const fn = jest.fn(function (this: any) {
    expect(Object.getPrototypeOf(this)).toBe(Rize.prototype)
  })
  const instance = new Rize({ afterLaunched: fn })
  await instance
    .execute(() => {
      expect(fn).toHaveBeenCalledTimes(1)
    })
    .end()
})

test('call a function before each step', async () => {
  const fn = jest.fn(function (this: any) {
    expect(Object.getPrototypeOf(this)).toBe(Rize.prototype)
  })
  const instance = new Rize({ beforeEachStep: fn })
  await instance
    .execute(() => expect(fn).toHaveBeenCalledTimes(1))
    .end()
})

test('call a function after each step', async () => {
  const fn = jest.fn(function (this: any) {
    expect(Object.getPrototypeOf(this)).toBe(Rize.prototype)
  })
  const instance = new Rize({ afterEachStep: fn })
  await instance
    .execute(() => 0)
    .execute(() => expect(fn).toHaveBeenCalledTimes(1))
    .end()
})

test('call a function before browser exit', async () => {
  const fn = jest.fn(function (this: any) {
    expect(Object.getPrototypeOf(this)).toBe(Rize.prototype)
  })
  const instance = new Rize({ beforeExit: fn })
  await instance.end()
  expect(fn).toHaveBeenCalledTimes(1)
})
