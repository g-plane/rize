import url from 'url'
import puppeteer from 'puppeteer'
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

  Rize.prototype.cookies = function () {
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
}
