import EventEmitter from 'events'
import puppeteer from 'puppeteer'

export default class Infrastructure {
  protected queue: symbol[] = []
  protected eventBus = new EventEmitter()

  /**
   * Low-level instance of puppeteer's browser.
   */
  public browser!: puppeteer.Browser

  /**
   * Low-level instance of puppeteer's current page.
   */
  public page!: puppeteer.Page

  protected push (fn: () => any) {
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

  protected clearQueue () {
    this.push(() => (this.queue = []))

    return this
  }

  protected clearQueueNow () {
    this.queue = []

    return this
  }
}
