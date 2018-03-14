import puppeteer from 'puppeteer'
import Rize from '../../src'

test('pass an existing puppeteer browser', async () => {
  const browser = await puppeteer.launch()
  const instance = new Rize({ browser })
  await instance.end()
}, process.env.CI ? 8000 : 5000)

test('set viewport', async () => {
  expect.assertions(1)
  const instance = new Rize({ width: 1920, height: 1080 })
  await instance
    .execute((browser, page) => {
      expect(page.viewport()).toEqual(expect.objectContaining({
         width: 1920,
         height: 1080
      }))
    })
    .end()
})
