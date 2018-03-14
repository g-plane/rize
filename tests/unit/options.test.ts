import puppeteer from 'puppeteer'
import Rize from '../../src'

test('pass an existing puppeteer browser', async () => {
  const browser = await puppeteer.launch()
  const instance = new Rize({ browser })
  await instance.end()
}, process.env.CI ? 8000 : 5000)
