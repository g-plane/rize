import url from 'url'
import crypto from 'crypto'
import puppeteer from 'puppeteer'
import Infrastructure from './infrastructure'
import { prepareStackTrace } from './utils/error'

export default class Retrieval extends Infrastructure {
  title () {
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

  text (selector = 'body') {
    return new Promise<string>((resolve, reject) => {
      this.push(async () => {
        try {
          const text: string = await this.page.$eval(
            selector,
            /* Instrumenting cannot be executed in browser. */
            /* istanbul ignore next */
            element => element.textContent
          )
          resolve(text)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  html (selector = 'html', range: 'inner' | 'outer' = 'inner') {
    return new Promise<string>((resolve, reject) => {
      this.push(async () => {
        try {
          const html: string = await this.page.$eval(
            selector,
            /* Instrumenting cannot be executed in browser. */
            /* istanbul ignore next */
            (element, r: 'inner' | 'outer') => r === 'outer'
              ? element.outerHTML
              : element.innerHTML,
            range
          )
          resolve(html)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  attribute (selector: string, attribute: string) {
    return new Promise<string | null>((resolve, reject) => {
      this.push(async () => {
        try {
          const value: string | null = await this.page.$eval(
            selector,
            /* Instrumenting cannot be executed in browser. */
            /* istanbul ignore next */
            (element, attr: string) => element.getAttribute(attr),
            attribute
          )
          resolve(value)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  style (selector: string, property: string) {
    return new Promise<string>((resolve, reject) => {
      this.push(async () => {
        try {
          const value: string = await this.page.$eval(
            selector,
            /* Instrumenting cannot be executed in browser. */
            /* istanbul ignore next */
            (element, prop: string) =>
              (element as HTMLElement).style.getPropertyValue(prop),
            property
          )
          resolve(value)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  value (selector: string): Promise<string | null>

  value (selector: string, newValue: string): this

  value (selector: string, newValue?: string): Promise<string | null> | this {
    if (newValue) {
      this.push(async () => {
        await this.page.$eval(
          selector,
          /* Instrumenting cannot be executed in browser. */
          /* istanbul ignore next */
          (element, val: string) => (element as HTMLInputElement).value = val,
          newValue
        )
      }, prepareStackTrace())

      return this
    } else {
      return this.attribute(selector, 'value')
    }
  }

  hasClass (selector: string, className: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.push(async () => {
        try {
          const exists: boolean = await this.page.$eval(
            selector,
            /* Instrumenting cannot be executed in browser. */
            /* istanbul ignore next */
            (element, cls: string) => element.classList.contains(cls),
            className
          )
          resolve(exists)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  url () {
    return new Promise(fulfill => {
      this.push(() => fulfill(this.page.url()))
    })
  }

  queryString (key: string): Promise<string | string[] | undefined> {
    return new Promise(fulfill => {
      this.push(() => {
        const { query } = url.parse(this.page.url(), true)
        fulfill(query[key])
      })
    })
  }

  cookie () {
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

  cookies () {
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

  isVisible (selector: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.push(async () => {
        try {
          const result: string | null = await this.page.$eval(
            selector,
            /* Instrumenting cannot be executed in browser. */
            /* istanbul ignore next */
            element => (element as HTMLElement).style.display
          )
          resolve(result !== 'none')
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  isPresent (selector: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.push(async () => {
        try {
          const element = await this.page.$(selector)
          resolve(!!element)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  find <T> (
    selector: string,
    fn: ((selector: string, ...args) => T),
    ...args
  ): T {
    const random = crypto.randomBytes(10).toString('hex')
    this.push(async () => {
      await this.page.$eval(
        selector,
        /* Instrumenting cannot be executed in browser. */
        /* istanbul ignore next */
        (element, id: string) => element.setAttribute('data-rize', id),
        random
      )
    })

    const returnValue: T = fn.call(this, `[data-rize="${random}"]`, ...args)

    this.push(async () => {
      await this.page.$eval(
        `[data-rize="${random}"]`,
        /* istanbul ignore next, Instrumenting cannot be executed in browser. */
        element => element.removeAttribute('data-rize')
      )
    })

    return returnValue
  }

  findAll <T> (
    selector: string,
    index: number,
    fn: ((selector: string, ...args) => T),
    ...args
  ): T {
    const random = crypto.randomBytes(10).toString('hex')
    this.push(async () => {
      await this.page.$$eval(
        selector,
        /* Instrumenting cannot be executed in browser. */
        /* istanbul ignore next */
        (elements, i: number, id: string) =>
          elements[i].setAttribute('data-rize', id),
        index,
        random
      )
    })

    const returnValue: T = fn.call(this, `[data-rize="${random}"]`, ...args)

    this.push(async () => {
      await this.page.$$eval(
        `[data-rize="${random}"]`,
        /* istanbul ignore next, Instrumenting cannot be executed in browser. */
        elements => Array
          .from(elements)
          .forEach(element => element.removeAttribute('data-rize'))
      )
    })

    return returnValue
  }

  findByXPath <T> (
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

    const returnValue: T = fn.call(this, `[data-rize="${random}"]`, ...args)

    this.push(async () => {
      await this.page.$$eval(
        `[data-rize="${random}"]`,
        /* istanbul ignore next, Instrumenting cannot be executed in browser. */
        elements => Array
          .from(elements)
          .forEach(element => element.removeAttribute('data-rize'))
      )
    })

    return returnValue
  }

  findWithText <T> (
    selector: string,
    text: string,
    index: number,
    fn: ((selector: string, ...args) => T),
    ...args
  ): T {
    const random = crypto.randomBytes(10).toString('hex')
    this.push(async () => {
      await this.page.evaluate(
        /* Instrumenting cannot be executed in browser. */
        /* istanbul ignore next */
        (sel: string, t: string, i: number, id: string) => {
          const element = Array
            .from(document.querySelectorAll(sel))
            .filter(el => (el.textContent || '').includes(t))[i]
          element.setAttribute('data-rize', id)
        },
        selector,
        text,
        index,
        random
      )
    })

    const returnValue: T = fn.call(this, `[data-rize="${random}"]`, ...args)

    this.push(async () => {
      await this.page.$eval(
        `[data-rize="${random}"]`,
        /* istanbul ignore next, Instrumenting cannot be executed in browser. */
        element => element.removeAttribute('data-rize')
      )
    })

    return returnValue
  }

  viewport () {
    return new Promise<puppeteer.Viewport>(
      fulfill => this.push(() => fulfill(this.page.viewport()))
    )
  }
}
