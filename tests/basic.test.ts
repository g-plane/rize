import puppeteer from 'puppeteer'
import Rize from '../src'

test('sleep for a short time', done => {
  expect.assertions(1)
  const instance = new Rize()
  const mock = jest.fn()
  instance.execute(() => (instance.page.waitFor = mock))
  instance
    .sleep(1)
    .execute(() => {
      expect(mock).toHaveBeenCalledWith(1)
      done()
    })
    .end()
}, process.env.CI ? 8000 : 5000)

test('execute a function', done => {
  expect.assertions(3)
  const instance = new Rize()
  instance
    .execute(function (browser, page) {
      expect(this).toBe(instance)
      expect(browser).toBe(instance.browser)
      expect(page).toBe(instance.page)
    })
    .end(done)
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
