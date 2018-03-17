import Rize from 'rize'

test('sleep for a short time', async () => {
  expect.assertions(1)
  const instance = new Rize()
  const mock = jest.fn()
  instance.execute(() => (instance.page.waitFor = mock))
  await instance
    .sleep(1)
    .execute(() => {
      expect(mock).toHaveBeenCalledWith(1)
    })
    .end()
}, process.env.CI ? 8000 : 5000)

test('execute a function', async () => {
  expect.assertions(3)
  const instance = new Rize()
  await instance
    .execute(function (browser, page) {
      expect(this).toBe(instance)
      expect(browser).toBe(instance.browser)
      expect(page).toBe(instance.page)
    })
    .end()
})

test('exit browser', async done => {
  expect.assertions(2)
  let instance = new Rize()
  await expect(instance.end()).resolves.toBeUndefined()

  instance = new Rize()
  const cb = jest.fn()
  instance.end(() => {
    cb()
    expect(cb).toHaveBeenCalled()
    done()
  })
})

test('await promise', async () => {
  expect.assertions(1)
  const instance = new Rize()
  await instance.awaitPromise()
  expect(instance.browser).toBeDefined()
  await instance.end()
})
