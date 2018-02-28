import url from 'url'
import crypto from 'crypto'
import RizeInstance from './index'

export default function mixinRetrieval (Rize: typeof RizeInstance) {
  Rize.prototype.title = function () {
    return new Promise<string>((resolve, reject) => {
      this.push(async () => {
        try {
          resolve(await this.page.title())
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  Rize.prototype.text = function (selector = 'body') {
    return new Promise<string>((resolve, reject) => {
      this.push(async () => {
        try {
          const text: string = await this.page.evaluate(
            /* Instrumenting cannot be executed in browser. */
            /* istanbul ignore next */
            sel => document.querySelector<HTMLElement>(sel)!.textContent,
            selector
          )
          resolve(text)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  Rize.prototype.html = function (selector = 'html') {
    return new Promise<string>((resolve, reject) => {
      this.push(async () => {
        try {
          const html: string = await this.page.evaluate(
            /* Instrumenting cannot be executed in browser. */
            /* istanbul ignore next */
            sel => document.querySelector<HTMLElement>(sel)!.innerHTML,
            selector
          )
          resolve(html)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  Rize.prototype.attribute = function (selector: string, attribute: string) {
    return new Promise<string | null>((resolve, reject) => {
      this.push(async () => {
        try {
          const value: string | null = await this.page.evaluate(
            /* Instrumenting cannot be executed in browser. */
            /* istanbul ignore next */
            (sel, attr) => document
              .querySelector<HTMLElement>(sel)!
              .getAttribute(attr),
            selector,
            attribute
          )
          resolve(value)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  Rize.prototype.style = function (selector: string, property: string) {
    return new Promise<string>((resolve, reject) => {
      this.push(async () => {
        try {
          const value: string = await this.page.evaluate(
            /* Instrumenting cannot be executed in browser. */
            /* istanbul ignore next */
            (sel, prop) => document
              .querySelector<HTMLElement>(sel)!
              .style.getPropertyValue(prop),
            selector,
            property
          )
          resolve(value)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  Rize.prototype.value = function (selector: string) {
    return this.attribute(selector, 'value')
  }

  Rize.prototype.hasClass = function (selector: string, className: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.push(async () => {
        try {
          const exists: boolean = await this.page.evaluate(
            /* Instrumenting cannot be executed in browser. */
            /* istanbul ignore next */
            (sel, cls) => document
              .querySelector<HTMLElement>(sel)!
              .classList.contains(cls),
            selector,
            className
          )
          resolve(exists)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  Rize.prototype.url = function () {
    return new Promise(fulfill => {
      this.push(() => fulfill(this.page.url()))
    })
  }

  Rize.prototype.queryString = function (key: string) {
    return new Promise(fulfill => {
      this.push(() => {
        const { query } = url.parse(this.page.url(), true)
        fulfill(query[key])
      })
    })
  }

  Rize.prototype.cookie = function () {
    return new Promise((resolve, reject) => {
      this.push(async () => {
        try {
          resolve((await this.page.cookies())[0])
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  Rize.prototype.cookies = function () {
    return new Promise((resolve, reject) => {
      this.push(async () => {
        try {
          resolve(await this.page.cookies())
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  Rize.prototype.isVisible = function (selector: string) {
    return new Promise((resolve, reject) => {
      this.push(async () => {
        try {
          const result: string = await this.page.evaluate(
            /* Instrumenting cannot be executed in browser. */
            /* istanbul ignore next */
            sel => document.querySelector<HTMLElement>(sel)!.style.display,
            selector
          )
          resolve(result !== 'none')
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  Rize.prototype.isPresent = function (selector: string) {
    return new Promise((resolve, reject) => {
      this.push(async () => {
        try {
          const element: HTMLElement | null = await this.page.evaluate(
            /* Instrumenting cannot be executed in browser. */
            /* istanbul ignore next */
            sel => document.querySelector<HTMLElement>(sel),
            selector
          )
          resolve(element !== null)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  Rize.prototype.find = function <T> (
    selector: string,
    fn: ((selector: string, ...args) => T),
    ...args
  ): T {
    const random = crypto.randomBytes(10).toString('hex')
    this.push(async () => {
      await this.page.evaluate(
        /* Instrumenting cannot be executed in browser. */
        /* istanbul ignore next */
        (sel: string, id: string) => document
          .querySelector<HTMLElement>(sel)!
          .setAttribute('data-rize', id),
        selector,
        random
      )
    })

    return fn.call(this, `[data-rize="${random}"]`, ...args)
  }

  Rize.prototype.findAll = function <T> (
    selector: string,
    index: number,
    fn: ((selector: string, ...args) => T),
    ...args
  ): T {
    const random = crypto.randomBytes(10).toString('hex')
    this.push(async () => {
      await this.page.evaluate(
        /* Instrumenting cannot be executed in browser. */
        /* istanbul ignore next */
        (sel: string, i: number, id: string) => document
          .querySelectorAll<HTMLElement>(sel)[i]
          .setAttribute('data-rize', id),
        selector,
        index,
        random
      )
    })

    return fn.call(this, `[data-rize="${random}"]`, ...args)
  }

  Rize.prototype.findByXPath = function <T> (
    expression: string,
    index: number,
    fn: ((selector: string, ...args) => T),
    ...args
  ): T {
    const random = crypto.randomBytes(10).toString('hex')
    this.push(async () => {
      await this.page.evaluate(
        /* Instrumenting cannot be executed in browser. */
        /* istanbul ignore next */
        (expr: string, i: number, id: string) => {
          const elements = document.evaluate(
            expr,
            document,
            null,
            XPathResult.ANY_TYPE,
            null
          )
          let element = elements.iterateNext()
          let it = 0
          while (element && it < i) {
            element = elements.iterateNext()
            it++
          }
          void (element as HTMLElement).setAttribute('data-rize', id)
        },
        expression,
        index,
        random
      )
    })

    return fn.call(this, `[data-rize="${random}"]`, ...args)
  }
}
