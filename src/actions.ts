import puppeteer from 'puppeteer'
import RizeInstance from './index'

export default function mixinActions (Rize: typeof RizeInstance) {
  Rize.prototype.click = function (selector: string) {
    this.push(async () => await this.page.click(selector))

    return this
  }

  Rize.prototype.doubleClick = function (selector: string) {
    this.push(async () => {
      await this.page.click(selector, { clickCount: 2 })
    })

    return this
  }

  Rize.prototype.rightClick = function (selector: string) {
    this.push(async () => {
      await this.page.click(selector, { button: 'right' })
    })

    return this
  }

  Rize.prototype.hover = function (selector: string) {
    this.push(async () => await this.page.hover(selector))

    return this
  }

  Rize.prototype.type = function (selector: string, text: string) {
    this.push(async () => await this.page.type(selector, text))

    return this
  }

  Rize.prototype.focus = function (selector: string) {
    this.push(async () => await this.page.focus(selector))

    return this
  }

  Rize.prototype.select = function (
    selector: string,
    values: string | string[]
  ) {
    this.push(async () => {
      if (Array.isArray(values)) {
        await this.page.select(selector, ...values)
      } else {
        await this.page.select(selector, values)
      }
    })

    return this
  }

  Rize.prototype.press = function (key: string, selector?: string) {
    this.push(async () => {
      if (selector) {
        await (await this.page.$(selector))!.press(key)
      } else {
        await this.page.keyboard.press(key)
      }
    })

    return this
  }

  Rize.prototype.keyDown = function (key: string) {
    this.push(async () => await this.page.keyboard.down(key))

    return this
  }

  Rize.prototype.keyUp = function (key: string) {
    this.push(async () => await this.page.keyboard.up(key))

    return this
  }

  Rize.prototype.mouseMoveTo = function (x: number, y: number) {
    this.push(async () => await this.page.mouse.move(x, y))

    return this
  }

  Rize.prototype.mouseClick = function (
    x: number,
    y: number,
    options?: puppeteer.MousePressOptions
  ) {
    this.push(async () => await this.page.mouse.click(x, y, options))

    return this
  }

  Rize.prototype.mouseDown = function (
    button: puppeteer.MouseButtons = 'left',
    clickCount: number = 1
  ) {
    this.push(async () => await this.page.mouse.down({ button, clickCount }))

    return this
  }

  Rize.prototype.mouseUp = function (
    button: puppeteer.MouseButtons = 'left',
    clickCount: number = 1
  ) {
    this.push(async () => await this.page.mouse.up({ button, clickCount }))

    return this
  }

  Rize.prototype.uploadFile = function (selector: string, path: string) {
    this.push(async () => await (await this.page.$(selector))!.uploadFile(path))

    return this
  }

  Rize.prototype.addClass = function (selector: string, className: string) {
    this.push(async () => {
      await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, cls) => document
          .querySelector<HTMLElement>(sel)!.classList.add(cls),
        selector,
        className
      )
    })

    return this
  }

  Rize.prototype.removeClass = function (selector: string, className: string) {
    this.push(async () => {
      await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, cls) => document
          .querySelector<HTMLElement>(sel)!.classList.remove(cls),
        selector,
        className
      )
    })

    return this
  }

  Rize.prototype.toggleClass = function (selector: string, className: string) {
    this.push(async () => {
      await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, cls) => document
          .querySelector<HTMLElement>(sel)!.classList.toggle(cls),
        selector,
        className
      )
    })

    return this
  }
}
