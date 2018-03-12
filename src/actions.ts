import puppeteer from 'puppeteer'
import Infrastructure from './infrastructure'
import { prepareStackTrace } from './utils/error'

export default class Actions extends Infrastructure {
  click (selector: string) {
    this.push(async () => await this.page.click(selector), prepareStackTrace())

    return this
  }

  doubleClick (selector: string) {
    this.push(
      async () => await this.page.click(selector, { clickCount: 2 }),
      prepareStackTrace()
    )

    return this
  }

  rightClick (selector: string) {
    this.push(
      async () => await this.page.click(selector, { button: 'right' }),
      prepareStackTrace()
    )

    return this
  }

  clickLink (text: string) {
    this.push(async () => {
      await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (t: string) => {
          const element = Array
            .from(document.querySelectorAll('a'))
            .find(el => (el.textContent || '').trim() === t)

          if (element) {
            element.click()
          } else {
            throw new Error(`Cannot find an element with text "${text}"`)
          }
        },
        text
      )
    }, prepareStackTrace())

    return this
  }

  hover (selector: string) {
    this.push(async () => await this.page.hover(selector), prepareStackTrace())

    return this
  }

  type (selector: string, text: string) {
    this.push(
      async () => await this.page.type(selector, text),
      prepareStackTrace()
    )

    return this
  }

  sendChar (char: string) {
    this.push(
      async () => await this.page.keyboard.sendCharacter(char),
      prepareStackTrace()
    )

    return this
  }

  clear (selector: string) {
    this.push(async () => {
      await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => {
          const element: HTMLInputElement | HTMLTextAreaElement =
            document.querySelector(sel)

          if (element.tagName === 'INPUT') {
            element.value = ''
          } else if (element.tagName === 'TEXTAREA') {
            element.textContent = ''
          } else {
            // Don't throw error.
            return
          }
        },
        selector
      )
    }, prepareStackTrace())

    return this
  }

  focus (selector: string) {
    this.push(async () => await this.page.focus(selector), prepareStackTrace())

    return this
  }

  select (selector: string, values: string | string[]) {
    this.push(async () => {
      if (Array.isArray(values)) {
        await this.page.select(selector, ...values)
      } else {
        await this.page.select(selector, values)
      }
    }, prepareStackTrace())

    return this
  }

  check (selector: string) {
    this.push(async () => {
      await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLInputElement>(sel)!.checked = true,
        selector
      )
    }, prepareStackTrace())

    return this
  }

  uncheck (selector: string) {
    this.push(async () => {
      await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLInputElement>(sel)!.checked = false,
        selector
      )
    }, prepareStackTrace())

    return this
  }

  radio (selector: string, value: string) {
    this.push(async () => {
      await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, val) => document
          .querySelector<HTMLInputElement>(`${sel}[value="${val}"]`)!
          .checked = true,
        selector,
        value
      )
    }, prepareStackTrace())

    return this
  }

  press (key: string, selector?: string) {
    this.push(async () => {
      if (selector) {
        await (await this.page.$(selector))!.press(key)
      } else {
        await this.page.keyboard.press(key)
      }
    }, prepareStackTrace())

    return this
  }

  keyDown (key: string) {
    this.push(
      async () => await this.page.keyboard.down(key),
      prepareStackTrace()
    )

    return this
  }

  keyUp (key: string) {
    this.push(async () => await this.page.keyboard.up(key), prepareStackTrace())

    return this
  }

  mouseMoveTo (x: number, y: number) {
    this.push(async () => await this.page.mouse.move(x, y), prepareStackTrace())

    return this
  }

  mouseClick (x: number, y: number, options?: puppeteer.MousePressOptions) {
    this.push(
      async () => await this.page.mouse.click(x, y, options),
      prepareStackTrace()
    )

    return this
  }

  mouseDown (button: puppeteer.MouseButtons = 'left', clickCount: number = 1) {
    this.push(
      async () => await this.page.mouse.down({ button, clickCount }),
      prepareStackTrace()
    )

    return this
  }

  mouseUp (button: puppeteer.MouseButtons = 'left', clickCount: number = 1) {
    this.push(
      async () => await this.page.mouse.up({ button, clickCount }),
      prepareStackTrace()
    )

    return this
  }

  uploadFile (selector: string, path: string) {
    this.push(
      async () => await (await this.page.$(selector))!.uploadFile(path),
      prepareStackTrace()
    )

    return this
  }

  addClass (selector: string, className: string) {
    this.push(async () => {
      await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, cls) => document
          .querySelector<HTMLElement>(sel)!.classList.add(cls),
        selector,
        className
      )
    }, prepareStackTrace())

    return this
  }

  removeClass (selector: string, className: string) {
    this.push(async () => {
      await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, cls) => document
          .querySelector<HTMLElement>(sel)!.classList.remove(cls),
        selector,
        className
      )
    }, prepareStackTrace())

    return this
  }

  toggleClass (selector: string, className: string) {
    this.push(async () => {
      await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, cls) => document
          .querySelector<HTMLElement>(sel)!.classList.toggle(cls),
        selector,
        className
      )
    }, prepareStackTrace())

    return this
  }

  setCookie (...cookies: puppeteer.SetCookie[]) {
    this.push(
      async () => await this.page.setCookie(...cookies),
      prepareStackTrace()
    )

    return this
  }

  deleteCookie (...cookies: puppeteer.DeleteCookie[]) {
    this.push(
      async () => await this.page.deleteCookie(...cookies),
      prepareStackTrace()
    )

    return this
  }
}
