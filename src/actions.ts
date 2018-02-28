import puppeteer from 'puppeteer'
import Infrastructure from './infrastructure'

export default class Actions extends Infrastructure {
  click (selector: string) {
    this.push(async () => await this.page.click(selector))

    return this
  }

  doubleClick (selector: string) {
    this.push(async () => {
      await this.page.click(selector, { clickCount: 2 })
    })

    return this
  }

  rightClick (selector: string) {
    this.push(async () => {
      await this.page.click(selector, { button: 'right' })
    })

    return this
  }

  hover (selector: string) {
    this.push(async () => await this.page.hover(selector))

    return this
  }

  type (selector: string, text: string) {
    this.push(async () => await this.page.type(selector, text))

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
    })

    return this
  }

  focus (selector: string) {
    this.push(async () => await this.page.focus(selector))

    return this
  }

  select (selector: string, values: string | string[]) {
    this.push(async () => {
      if (Array.isArray(values)) {
        await this.page.select(selector, ...values)
      } else {
        await this.page.select(selector, values)
      }
    })

    return this
  }

  check (selector: string) {
    this.push(async () => {
      await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLInputElement>(sel)!.checked = true,
        selector
      )
    })

    return this
  }

  uncheck (selector: string) {
    this.push(async () => {
      await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLInputElement>(sel)!.checked = false,
        selector
      )
    })

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
    })

    return this
  }

  press (key: string, selector?: string) {
    this.push(async () => {
      if (selector) {
        await (await this.page.$(selector))!.press(key)
      } else {
        await this.page.keyboard.press(key)
      }
    })

    return this
  }

  keyDown (key: string) {
    this.push(async () => await this.page.keyboard.down(key))

    return this
  }

  keyUp (key: string) {
    this.push(async () => await this.page.keyboard.up(key))

    return this
  }

  mouseMoveTo (x: number, y: number) {
    this.push(async () => await this.page.mouse.move(x, y))

    return this
  }

  mouseClick (x: number, y: number, options?: puppeteer.MousePressOptions) {
    this.push(async () => await this.page.mouse.click(x, y, options))

    return this
  }

  mouseDown (button: puppeteer.MouseButtons = 'left', clickCount: number = 1) {
    this.push(async () => await this.page.mouse.down({ button, clickCount }))

    return this
  }

  mouseUp (button: puppeteer.MouseButtons = 'left', clickCount: number = 1) {
    this.push(async () => await this.page.mouse.up({ button, clickCount }))

    return this
  }

  uploadFile (selector: string, path: string) {
    this.push(async () => await (await this.page.$(selector))!.uploadFile(path))

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
    })

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
    })

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
    })

    return this
  }
}
