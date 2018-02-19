import EventEmitter from 'events'
import puppeteer from 'puppeteer'
import mixinBasic from './basic'

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
          // tslint:disable-next-line no-bitwise
          ? !~options.args.indexOf('--no-sandbox')
            ? options.args.push('--no-sandbox')
            : undefined   // tslint:disable-line no-unused-expression
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
      await fn()
      this.eventBus.emit(this.queue[this.queue.indexOf(unique) + 1])
      this.queue.shift()
    })

    if (this.browser && this.page && this.queue.length === 1) {
      this.eventBus.emit(unique)
    }

    return this
  }

  /* basic START */

  goto (url: string) {
    return this
  }

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
}

mixinBasic(Rize)
