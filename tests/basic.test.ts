import puppeteer from 'puppeteer'
import Rize from '../src'

test('sleep for a short time', done => {
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
  const instance = new Rize()
  instance
    .execute(function (browser, page) {
      expect(this).toBe(instance)
      expect(browser).toBe(this.browser)
      expect(page).toBe(this.page)
    })
    .end(done)
})

test('exit browser and run callback', done => {
  const instance = new Rize()
  const cb = jest.fn()
  instance.end(() => {
    cb()
    expect(cb).toHaveBeenCalled()
    done()
    instance.browser.close()
  })
})
