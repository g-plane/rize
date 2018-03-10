import EventEmitter from 'events'
import puppeteer from 'puppeteer'
import { beautifyStack } from './utils/error'

export default class Infrastructure {
  protected queue: symbol[] = []
  protected eventBus = new EventEmitter()

  protected hooks = {
    beforeLaunch () {/* placeholder */},
    afterLaunched () {/* placeholder */}
  }

  protected currentPageIndex = 0
  protected preservePage!: puppeteer.Page
  protected pages: Array<{ name: string, page: puppeteer.Page }> = []

  /**
   * Low-level instance of puppeteer's browser.
   */
  public browser!: puppeteer.Browser

  /**
   * Low-level instance of puppeteer's current page.
   */
  get page () {
    const currentPage = this.pages[this.currentPageIndex]
    return currentPage ? currentPage.page : this.preservePage
  }

  protected push (fn: () => any, trace?: Error) {
    const unique = Symbol()
    this.queue.push(unique)
    this.eventBus.once(unique, async () => {
      try {
        await fn()
      } catch (error) {
        if (trace) {
          throw beautifyStack(trace, error)
        } else {
          throw error
        }
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

  protected clearQueue () {
    this.push(() => (this.queue = []))

    return this
  }

  protected clearQueueNow () {
    this.queue = []

    return this
  }
}
