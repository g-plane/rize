import puppeteer from 'puppeteer'
import Rize from '../src'
import createServer from './server'

test('go to a specified url', done => {
  const server = createServer()
  const instance = new Rize()
  instance.goto('http://localhost:4321/').execute(() => {
    expect(instance.page.url()).toBe('http://localhost:4321/')
    done()
    instance.browser.close()
    server.close()
  })
})

test('sleep for a short time', done => {
  const instance = new Rize()
  const mock = jest.fn()
  instance.execute(() => (instance.page.waitFor = mock))
  instance.sleep(1).execute(() => {
    expect(mock).toHaveBeenCalledWith(1)
    done()
    instance.browser.close()
  })
})

test('close page', done => {
  const instance = new Rize()
  instance.closePage().execute(() => {
    expect(
      (instance.page as puppeteer.Page & { _client })._client._connection
    ).toBeFalsy()
    done()
    instance.browser.close()
  })
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
