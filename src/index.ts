import EventEmitter from 'events'
import puppeteer from 'puppeteer'
import mixinBasic from './basic'
import mixinPage from './page'
import mixinAssertions from './assertions'

export interface RizeOptions {
  beforeLaunch? (args?: any[]): void
  afterLaunched? (args?: any[]): void
}

export default class Rize {
  private queue: symbol[] = []
  private eventBus = new EventEmitter()
  public browser!: puppeteer.Browser
  public page!: puppeteer.Page

  constructor (options: puppeteer.LaunchOptions & RizeOptions = {}) {
    (async () => {
      options.beforeLaunch && options.beforeLaunch()

      if (process.env.TRAVIS && process.platform === 'linux') {
        options.args
          ? options.args.includes('--no-sandbox')
            ? undefined // tslint:disable-line no-unused-expression
            : options.args.push('--no-sandbox')
          : (options.args = ['--no-sandbox'])
      }

      this.browser = await puppeteer.launch(options)
      this.page = await this.browser.newPage()

      options.afterLaunched && options.afterLaunched()

      const first = this.queue[0]
      if (first) {
        this.eventBus.emit(first)
      }
    })()
  }

  /**
   * Unless you know what you want to do,
   * please do not use this function directly.
   *
   * @param fn Function to be pushed to queue.
   * @returns {this}
   *
   * @private
   */
  push (fn: () => void | Promise<void>) {
    const unique = Symbol()
    this.queue.push(unique)
    this.eventBus.once(unique, async () => {
      try {
        await fn()
      } catch (error) {
        throw error
      } finally {
        this.eventBus.emit(this.queue[this.queue.indexOf(unique) + 1])
        this.queue.shift()
      }
    })

    if (this.browser && this.page && this.queue.length === 1) {
      this.eventBus.emit(unique)
    }

    return this
  }

  clear () {
    this.queue = []
    return this
  }

  /* basic START */

  sleep (ms: number) {
    return this
  }

  withUserAgent (userAgent: string) {
    return this
  }

  execute (fn: (args?: any[]) => void) {
    return this
  }

  closePage () {
    return this
  }

  end (callback?: (args?: any[]) => void) {
    return
  }

  /* basic END */

  /* page START */

  goto (url: string) {
    return this
  }

  forward (options?: puppeteer.NavigationOptions) {
    return this
  }

  back (options?: puppeteer.NavigationOptions) {
    return this
  }

  refresh (options?: puppeteer.NavigationOptions) {
    return this
  }

  screenshot (path: string, options?: puppeteer.ScreenshotOptions) {
    return this
  }

  pdf (path: string, options?: puppeteer.PDFOptions) {
    return this
  }

  /* page END */

  /* assertions START */

  assertUrlIs (expected: string) {
    return this
  }

  assertPathIs (expected: string) {
    return this
  }

  assertPathBeginsWith (expected: string) {
    return this
  }

  assertTitle (title: string) {
    return this
  }

  assertTitleContains (title: string) {
    return this
  }

  assertQueryStringHas (key: string, value?: string) {
    return this
  }

  assertQueryStringMissing (key: string) {
    return this
  }

  assertCookiesHas (name: string, value?: string) {
    return this
  }

  assertSee (text: string) {
    return this
  }

  assertSeeIn (selector: string, text: string) {
    return this
  }

  /* assertions END */
}

mixinBasic(Rize)
mixinPage(Rize)
mixinAssertions(Rize)
