import puppeteer from 'puppeteer'
import Rize from '../src'

test('go to a specified url', done => {
  const instance = new Rize({
    afterLaunched () {
      jest.spyOn(instance.page, 'goto').mockImplementation(() => true)
    }
  })
  instance
    .goto('url')
    .execute(() => {
      expect(instance.page.goto).toBeCalledWith('url')
    })
    .end(done)
}, process.env.CI ? 8000 : 5000)

test('go forward', done => {
  const instance = new Rize({
    afterLaunched () {
      jest.spyOn(instance.page, 'goForward').mockImplementation(() => true)
    }
  })
  instance
    .forward()
    .execute(() => {
      expect(instance.page.goForward).toBeCalled()
    })
    .forward({ timeout: 1 })
    .execute(() => {
      expect(
        (instance.page.goForward as ((
          options?: puppeteer.NavigationOptions
        ) => Promise<puppeteer.Response>) &
          jest.MockInstance<any>).mock.calls[1][0]
      ).toEqual({ timeout: 1 })
    })
    .end(done)
})

test('go back', done => {
  const instance = new Rize({
    afterLaunched () {
      jest.spyOn(instance.page, 'goBack').mockImplementation(() => true)
    }
  })
  instance
    .back()
    .execute(() => {
      expect(instance.page.goBack).toBeCalled()
    })
    .back({ timeout: 1 })
    .execute(() => {
      expect(
        (instance.page.goBack as ((
          options?: puppeteer.NavigationOptions
        ) => Promise<puppeteer.Response>) &
          jest.MockInstance<any>).mock.calls[1][0]
      ).toEqual({ timeout: 1 })
    })
    .end(done)
})

test('refresh page', done => {
  const instance = new Rize({
    afterLaunched () {
      jest.spyOn(instance.page, 'reload').mockImplementation(() => true)
    }
  })
  instance
    .refresh()
    .execute(() => {
      expect(instance.page.reload).toBeCalled()
    })
    .refresh({ timeout: 1 })
    .execute(() => {
      expect(
        (instance.page.reload as ((
          options?: puppeteer.NavigationOptions
        ) => Promise<puppeteer.Response>) &
          jest.MockInstance<any>).mock.calls[1][0]
      ).toEqual({ timeout: 1 })
    })
    .end(done)
})

test('generate a screenshot', done => {
  const instance = new Rize({
    afterLaunched () {
      jest.spyOn(instance.page, 'screenshot').mockImplementation(() => true)
    }
  })
  instance
    .saveScreenshot('file1')
    .execute(() => {
      expect(instance.page.screenshot).toBeCalledWith({ path: 'file1' })
    })
    .saveScreenshot('file2', { type: 'jpeg' })
    .execute(() => {
      expect(instance.page.screenshot as (typeof instance.page.screenshot) &
        jest.MockInstance<any>).toBeCalledWith({ path: 'file2', type: 'jpeg' })
    })
    .end(done)
})

test('generate a PDF', done => {
  const instance = new Rize({
    afterLaunched () {
      jest.spyOn(instance.page, 'pdf').mockImplementation(() => true)
    }
  })
  instance
    .savePDF('file1')
    .execute(() => {
      expect(instance.page.pdf).toBeCalledWith({ path: 'file1' })
    })
    .savePDF('file2', { format: 'Letter' })
    .execute(() => {
      expect(instance.page.pdf as (typeof instance.page.pdf) &
        jest.MockInstance<any>).toBeCalledWith({
        path: 'file2',
        format: 'Letter'
      })
    })
    .end(done)
})
