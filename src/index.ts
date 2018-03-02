import puppeteer from 'puppeteer'

import Infrastructure from './infrastructure'
import Actions from './actions'
import Assertions from './assertions'
import Basic from './basic'
import Page from './page'
import Retrieval from './retrieval'

export interface RizeOptions {
  /**
   * A lifecycle hook which you can do something before the browser launching.
   *
   * @param {any} args Arguments of the functions.
   * @memberof RizeOptions
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize({
   *   beforeLaunch () {
   *     console.log('The browser is going to launch.')
   *   }
   * })
   * ```
   */
  beforeLaunch? (...args): void

  /**
   * A lifecycle hook which you can do something after the browser launched.
   *
   * `this` context points to the `Rize` instance.
   * So you can visit browser and page here.
   * (Like `this.browser` or `this.page`)
   *
   * @param {any} args Arguments of the functions.
   * @memberof RizeOptions
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize({
   *   afterLaunched () {
   *     this === rize  // true
   *     console.log('The browser has launched.')
   *   }
   * })
   * ```
   */
  afterLaunched? (this: Rize, ...args): void

  /**
   * Width of viewport.
   *
   * @type {number}
   * @memberof RizeOptions
   */
  width?: number

  /**
   * Height of viewport.
   *
   * @type {number}
   * @memberof RizeOptions
   */
  height?: number
}

export default class Rize
  extends Infrastructure
  implements Actions, Assertions, Basic, Page, Retrieval {

  /**
   * Creates an instance of `Rize`.
   */
  constructor (options: puppeteer.LaunchOptions & RizeOptions = {}) {
    super()
    void (async () => {
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

      await this.page.setViewport({
        width: options.width || 1280,
        height: options.height || 720
      })

      options.afterLaunched && options.afterLaunched.call(this)

      const first = this.queue[0]
      if (first) {
        this.eventBus.emit(first)
      }
    })()
  }

  /* basic START */

  /**
   * Sleep and wait for a time.
   *
   * @param ms Time to sleep. The unit is millisecond.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.sleep(500)  // stop for 500ms
   * ```
   */
  sleep (ms: number) {
    return this
  }

  /**
   * Execute a function.
   *
   * When you use `function` keyword (not arrow function),
   * `this` context in the function points to current `Rize` instance.
   *
   * NOTE that the function will be executed in Node environment,
   * not in browser.
   *
   * If you want to evaluate an function in browser environment,
   * please use `evaluate` method instead.
   *
   * @param fn The function to be execute.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.execute(function (browser, page) {
   *   this === rize  // true
   *   browser === rize.browser  // true
   *   page === rize.page  // true
   * })
   * ```
   */
  execute (fn: (
    this: Rize,
    browser: puppeteer.Browser,
    page: puppeteer.Page,
    ...args
  ) => void) {
    return this
  }

  /**
   * Exit browser.
   * You can pass a callback,
   * and the callback will be called after browser exited.
   *
   * @param callback
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.end()
   * ```
   *
   * or
   *
   * ```javascript
   * const rize = new Rize()
   * rize.end(() => console.log('Browser has exited.'))
   * ```
   */
  end (callback?: (...args) => any) {
    return
  }

  /* basic END */

  /* page START */

  /**
   * Go to a give URL.
   * If the URL cannot be accessed, an error will be threw.
   *
   * @param url URL to be navigated.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.goto('https://github.com/')
   * ```
   */
  goto (url: string) {
    return this
  }

  /**
   * Close current page, but it doesn't exit the browser.
   *
   * **You cannot visit the page any more!**
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.closePage()
   * ```
   */
  closePage () {
    return this
  }

  /* tslint:disable max-line-length */
  /**
   * Go forward.
   *
   * @param options `puppeteer`'s navigation options.
   *
   * @see https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegoforwardoptions
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.forward()
   * ```
   */
  /* tslint:enable max-line-length */
  forward (options?: puppeteer.NavigationOptions) {
    return this
  }

  /* tslint:disable max-line-length */
  /**
   * Go back.
   *
   * @param options `puppeteer`'s navigation options.
   *
   * @see https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegobackoptions
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.back()
   * ```
   */
  /* tslint:enable max-line-length */
  back (options?: puppeteer.NavigationOptions) {
    return this
  }

  /**
   * Refresh current page.
   *
   * @param options `puppeteer`'s navigation options.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.refresh()
   * ```
   */
  refresh (options?: puppeteer.NavigationOptions) {
    return this
  }

  /**
   * Evaluate a function or an expression in browser.
   *
   * This method will *not* retrieve the return value and
   * this method returns `this` to make API chainable.
   * If you want to retrieve the return value,
   * please use `evaluateWithReturn` method.
   *
   * Note that this function or expression will be evaluated
   * in browser environment, not in Node.js environment.
   * So you *can* visit variables in browser also
   * you *cannot* visit variables in Node.js.
   *
   * If you want to execute a function in Node.js environment,
   * please use `execute` method instead.
   *
   * @param fn Function or expression.
   * @param args Arguments of function.
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.evaluate(() => document.querySelector('div'))
   * rize.evaluate(selector => document.querySelector(selector), 'div')
   * rize.evaluate('document.querySelector("div")')
   * ```
   */
  evaluate (fn: Function | string, ...args) {
    return this
  }

  /**
   * Evaluate a function or an expression in browser
   * and retrieve return value.
   *
   * Note that this function or expression will be evaluated
   * in browser environment, not in Node.js environment.
   * So you *can* visit variables in browser also
   * you *cannot* visit variables in Node.js.
   *
   * If you want to execute a function in Node.js environment,
   * please use `execute` method instead.
   *
   * @param fn Function or expression.
   * @param args Arguments of function.
   * @returns Promise-wrapped return value of the given function.
   *
   * @example
   *
   * ```javascript
   *
   * (async () => {
   *   const rize = new Rize()
   *   const title = await rize.evaluateWithReturn(() => document.title)
   *   const text = await rize.evaluateWithReturn('document.body.textContent')
   * })()
   * ```
   */
  evaluateWithReturn <T = any> (
    fn: ((...args) => T) | string,
    ...args
  ): Promise<T> {
    return Promise.resolve((fn as (...args) => T)())
  }

  /**
   * Set the give user agent string.
   *
   * @param userAgent The user agent string you want to use.
   *
   * @see http://useragentstring.com/
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.withUserAgent('Chrome')
   * ```
   */
  withUserAgent (userAgent: string) {
    return this
  }

  /* tslint:disable max-line-length */
  /**
   * Save a screenshot of current page.
   *
   * @param path Path to screenshot file.
   * @param options `puppeteer`'s screenshots options.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.saveScreenshot('/path/to/file.png')  // save to a absolute path
   * rize.saveScreenshot('pics/file.png')  // save to a relative path (current directory)
   * ```
   */
  /* tslint:enable max-line-length */
  saveScreenshot (path: string, options?: puppeteer.ScreenshotOptions) {
    return this
  }

  /* tslint:disable max-line-length */
  /**
   * Save a PDF file of current page.
   *
   * @param path Path to PDF file.
   * @param options `puppeteer`'s PDF options.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.savePDF('/path/to/file.pdf')  // save to a absolute path
   * rize.savePDF('save/file.pdf')  // save to a relative path (current directory)
   * ```
   */
  /* tslint:enable max-line-length */
  savePDF (path: string, options?: puppeteer.PDFOptions) {
    return this
  }

  /**
   * Pause and wait for navigation. (including redirecting and refreshing)
   *
   * You can specify maximum navigation time (in milliseconds).
   * Pass `0` to disable.
   *
   * @param timeout Maximum navigation time in milliseconds.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.waitForNavigation()
   * rize.waitForNavigation(500)  // Timeout is 500ms
   * ```
   */
  waitForNavigation (timeout?: number) {
    return this
  }

  /**
   * Pause and wait for an element by the given selector.
   *
   * @param selector CSS selector.
   * @param timeout Maximum time.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.waitForElement('div')
   * rize.waitForElement('div', 500)  // Timeout is 500ms
   * ```
   */
  waitForElement (selector: string, timeout?: number) {
    return this
  }

  /**
   * Pause and wait for evaluating an expression or a function.
   *
   * The function or expression you given will be evaluated
   * in *browser* not in *Node.js* environment.
   *
   * **NOTE**:
   *
   * The function or expression will be evaluated many times and puppeteer
   * will check the result of expression or the return value of function.
   * If the result or return value is a falsy value,
   * your function or expression will be evaluated again.
   * And if the result or return value is a truthy value,
   * your function or expression won't be evaulated any more and then go ahead.
   *
   * That is, your function or expression will be evaluated in a loop until
   * the result or return value is a truthy value.
   *
   * @param fn Expression (you should pass it as string) or function.
   * @param timeout Maximum time to wait for in milliseconds.
   * @param args Arguments of function. No need for expression.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.waitForEvaluation(() => window.innerWidth < 100)
   * rize.waitForEvaluation('window.innerWidth < 100')
   * rize.waitForEvaluation(() => window.innerWidth < 100, 30000)
   * rize.waitForEvaluation('window.innerWidth < 100', 30000)
   * rize.waitForEvaluation(width => window.innerWidth < width, 30000, 100)
   * ```
   */
  waitForEvaluation (fn: string | Function, timeout?: number, ...args) {
    return this
  }

  /**
   * Provide credentials for http authentication.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.withAuth('yourname', 'secret')
   * ```
   */
  withAuth (username: string, password: string) {
    return this
  }

  /**
   * Add a `<script>` tag to page.
   * Note that the `<script>` tag will be appended to `<head>` section.
   *
   * If you pass `url` to argument `type`,
   * you should specify a JavaScript file URL in argument `value`.
   *
   * If you pass `path` to argument `type`,
   * you should specify a path to a JavaScript file in argument `value`.
   *
   * If you pass `content` to argument `type`,
   * you should pass pure JavaScript code in argument `value`.
   *
   * @param type Can be `url`, `path` or `content`.
   * @param value
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.addScriptTag('url', 'https://example.org/script.js')
   * rize.addScriptTag('path', 'path/to/file.js')
   * rize.addScriptTag('content', 'console.log("Pure JS code.")')
   * ```
   */
  addScriptTag (type: keyof puppeteer.ScriptTagOptions, value: string) {
    return this
  }

  /**
   * Add a `<style>` tag to page.
   * Note that the `<style>` tag will be appended to `<head>` section.
   *
   * If you pass `url` to argument `type`,
   * you should specify a CSS file URL in argument `value`.
   *
   * If you pass `path` to argument `type`,
   * you should specify a path to a CSS file in argument `value`.
   *
   * If you pass `content` to argument `type`,
   * you should pass pure CSS code in argument `value`.
   *
   * @param type Can be `url`, `path` or `content`.
   * @param value
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.addStyleTag('url', 'https://example.org/style.css')
   * rize.addStyleTag('path', 'path/to/file.css')
   * rize.addStyleTag('content', 'div { font-size: 5px; }')
   * ```
   */
  addStyleTag (type: keyof puppeteer.StyleTagOptions, value: string) {
    return this
  }

  /* page END */

  /* assertions START */

  /**
   * Assert that the current URL matches the given URL.
   *
   * @param expected Expected URL.
   *
   * @example
   *
   * ```javascript
   *
   * // Suppose the URL is "http://localhost/"
   *
   * const rize = new Rize()
   * rize.assertUrlIs('http://localhost/')
   * ```
   */
  assertUrlIs (expected: string) {
    return this
  }

  /**
   * Assert that the current URL matches the given regular expression.
   *
   * @param regex Regular expression.
   *
   * @example
   *
   * ```javascript
   *
   * // Suppose the URL is "http://localhost/"
   *
   * const rize = new Rize()
   * rize.assertUrlMatch('^http')
   * rize.assertUrlMatch(/^http/)
   * ```
   */
  assertUrlMatch (regex: RegExp | string) {
    return this
  }

  /**
   * Assert that the current path matches the given path.
   *
   * @param expected Expected path.
   *
   * @example
   *
   * ```javascript
   *
   * // Suppose the URL is "http://localhost/rabbit-house/rize"
   *
   * const rize = new Rize()
   * rize.assertPathIs('/rabbit-house/rize')
   * ```
   */
  assertPathIs (expected: string) {
    return this
  }

  /**
   * Assert that the current path begins with the given string.
   *
   * @param expected Expected string.
   *
   * @example
   *
   * ```javascript
   *
   * // Suppose the URL is "http://localhost/rabbit-house/rize"
   *
   * const rize = new Rize()
   * rize.assertPathBeginsWith('/rabbit-house')
   * ```
   */
  assertPathBeginsWith (expected: string) {
    return this
  }

  /**
   * Assert that current page title matches the given title.
   *
   * @param title Expected title.
   *
   * @example
   *
   * ```javascript
   *
   * // Suppose the title of page is "Tedeza Rize".
   *
   * const rize = new Rize()
   * rize.assertTitle('Tedeza Rize')
   * ```
   */
  assertTitle (title: string) {
    return this
  }

  /**
   * Assert that current page title contains the give string.
   *
   * @param title Expected string.
   *
   * @example
   *
   * ```javascript
   *
   * // Suppose the title of page is "Tedeza Rize".
   *
   * const rize = new Rize()
   * rize.assertTitleContains('Rize')
   * ```
   */
  assertTitleContains (title: string) {
    return this
  }

  /**
   * Assert that title of current page matches the given regular expression.
   *
   * @param regex Regular expression.
   *
   * @example
   *
   * ```javascript
   *
   * // Suppose the title of page is "Tedeza Rize".
   *
   * const rize = new Rize()
   * rize.assertTitleMatch('Rize$')
   * rize.assertTitleMatch(/Rize$/)
   * ```
   */
  assertTitleMatch (regex: RegExp | string) {
    return this
  }

  /**
   * Assert that query string has the given key.
   *
   * You can pass an expected value as the second argument.
   * Then it will check the value of given key in query string.
   *
   * @param key Expected key in query string.
   * @param value Expected value of a key in query string.
   *
   * @example
   *
   * ```javascript
   *
   * // Suppose the URL is "http://localhost/?key=value"
   *
   * const rize = new Rize()
   * rize.assertQueryStringHas('key')
   * rize.assertQueryStringHas('key', 'value')
   * ```
   */
  assertQueryStringHas (key: string, value?: string) {
    return this
  }

  /**
   * Assert that the given key is not in query string.
   *
   * @param key Expected missing key.
   *
   * @example
   *
   * ```javascript
   *
   * // Suppose the URL is "http://localhost/?key=value"
   *
   * const rize = new Rize()
   * rize.assertQueryStringMissing('nope')
   * ```
   */
  assertQueryStringMissing (key: string) {
    return this
  }

  /**
   * Assert that the cookie of current page has the given name and value.
   *
   * You can pass an expected value as the second argument.
   * Then it will check the value of given name in cookie.
   *
   * @param name Expected cookie name.
   * @param value Expected cookie value.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.assertCookieHas('name')
   * rize.assertCookieHas('name', 'value')
   * ```
   */
  assertCookieHas (name: string, value?: string) {
    return this
  }

  /**
   * Assert that the page contains the given text.
   *
   * Text created and rendered by JavaScript dynamically is acceptable.
   *
   * @param text Expected text.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.assertSee('some text in HTML.')
   * ```
   */
  assertSee (text: string) {
    return this
  }

  /**
   * Assert that the given text appears on the page.
   *
   * @param text Expected text.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.assertDontSee('Nothing in HTML.')
   * ```
   */
  assertDontSee (text: string) {
    return this
  }

  /**
   * Assert that the given text can be found by the given selector.
   *
   * @param selector CSS selector.
   * @param text Expected text you don't want to see.
   *
   * @example
   *
   * Suppose the HTML structure:
   *
   * ```html
   * <div class="my-class">some text in HTML</div>
   * ```
   *
   * ```javascript
   * const rize = new Rize()
   * rize.assertSeeIn('.my-class', 'some text in HTML')
   * ```
   */
  assertSeeIn (selector: string, text: string) {
    return this
  }

  /**
   * Assert that the given text does not appear within the given selector.
   *
   * @param selector CSS selector.
   * @param text Expected text you don't want to see.
   *
   * @example
   *
   * Suppose the HTML structure:
   *
   * ```html
   * <div class="my-class">some text in HTML</div>
   * ```
   *
   * ```javascript
   * const rize = new Rize()
   * rize.assertDontSeeIn('.my-class', 'nothing')
   * ```
   */
  assertDontSeeIn (selector: string, text: string) {
    return this
  }

  /**
   * Assert that an element by the given selector has the given
   * attribute and value.
   *
   * @param selector CSS selector.
   * @param attribute Attribute name.
   * @param value Expected value.
   *
   * @example
   *
   * Suppose the HTML structure:
   *
   * ```html
   * <div class="rabbit-house"></div>
   * ```
   *
   * ```javascript
   * const rize = new Rize()
   * rize.assertAttribute('div', 'class', 'rabbit-house')
   * ```
   */
  assertAttribute (selector: string, attribute: string, value: string) {
    return this
  }

  /**
   * Assert that an element by given selector has the given class name.
   *
   * @param selector CSS selector.
   * @param className Expected class name.
   *
   * @example
   *
   * Suppose the HTML structure:
   *
   * ```html
   * <div class="rabbit-house"></div>
   * ```
   *
   * ```javascript
   * const rize = new Rize()
   * rize.assertClassHas('div', 'rabbit-house')
   * ```
   */
  assertClassHas (selector: string, className: string) {
    return this
  }

  /**
   * Assert that the given element does not have the given class name.
   *
   * @param selector CSS selector.
   * @param className Class name.
   *
   * @example
   *
   * Suppose the HTML structure:
   *
   * ```html
   * <div class="rabbit-house"></div>
   * ```
   *
   * ```javascript
   * const rize = new Rize()
   * rize.assertClassMissing('div', 'rabbit')
   * ```
   */
  assertClassMissing (selector: string, className: string) {
    return this
  }

  /**
   * Assert that an element has the given style.
   *
   * @param selector CSS selector.
   * @param property CSS property.
   * @param value CSS value.
   *
   * @example
   *
   * Suppose the HTML structure:
   *
   * ```html
   * <div style="font-size: 5px"></div>
   * ```
   *
   * ```javascript
   * const rize = new Rize()
   * rize.assertStyleHas('div', 'font-size', '5px')
   * ```
   */
  assertStyleHas (selector: string, property: string, value: string) {
    return this
  }

  /**
   * Assert that the given element has expected value.
   *
   * @param selector CSS selector.
   * @param value Expected value.
   *
   * Suppose the HTML structure:
   *
   * ```html
   * <input value="val" />
   * ```
   *
   * ```javascript
   * const rize = new Rize()
   * rize.assertValueIs('input', 'val')
   * ```
   */
  assertValueIs (selector: string, value: string) {
    return this
  }

  /**
   * Assert that the given element does not have expected value.
   *
   * @param selector CSS selector.
   * @param value Expected value.
   *
   * Suppose the HTML structure:
   *
   * ```html
   * <input value="val" />
   * ```
   *
   * ```javascript
   * const rize = new Rize()
   * rize.assertValueIsNot('input', 'value')
   * ```
   */
  assertValueIsNot (selector: string, value: string) {
    return this
  }

  /**
   * Assert that the given element contains expected value.
   *
   * @param selector CSS selector.
   * @param value Expected value.
   *
   * Suppose the HTML structure:
   *
   * ```html
   * <input value="value" />
   * ```
   *
   * ```javascript
   * const rize = new Rize()
   * rize.assertValueContains('input', 'val')
   * ```
   */
  assertValueContains (selector: string, value: string) {
    return this
  }

  /**
   * Assert that the given checkbox has been checked.
   *
   * @param selector CSS selector.
   *
   * Suppose the HTML structure:
   *
   * ```html
   * <input type="checkbox" checked />
   * ```
   *
   * ```javascript
   * const rize = new Rize()
   * rize.assertChecked('input')
   * ```
   */
  assertChecked (selector: string) {
    return this
  }

  /**
   * Assert that the given checkbox has not been checked.
   *
   * @param selector CSS selector.
   *
   * Suppose the HTML structure:
   *
   * ```html
   * <input type="checkbox" />
   * ```
   *
   * ```javascript
   * const rize = new Rize()
   * rize.assertNotChecked('input')
   * ```
   */
  assertNotChecked (selector: string) {
    return this
  }

  /**
   * Assert that the given radio button has been selected.
   *
   * @param selector CSS selector.
   * @param value Radio button value.
   *
   * Suppose the HTML structure:
   *
   * ```html
   * <input type="radio" name="characters" value="rize" checked />
   * <input type="radio" name="characters" value="chino" />
   * ```
   *
   * ```javascript
   * const rize = new Rize()
   * rize.assertRadioSelected('input', 'rize')
   * ```
   */
  assertRadioSelected (selector: string, value: string) {
    return this
  }

  /**
   * Assert that the given radio button has not been selected.
   *
   * @param selector CSS selector.
   * @param value Radio button value.
   *
   * Suppose the HTML structure:
   *
   * ```html
   * <input type="radio" name="characters" value="rize" checked />
   * <input type="radio" name="characters" value="chino" />
   * ```
   *
   * ```javascript
   * const rize = new Rize()
   * rize.assertRadioNotSelected('input', 'chino')
   * ```
   */
  assertRadioNotSelected (selector: string, value: string) {
    return this
  }

  /**
   * Assert that the given `<option>` element has been selected.
   *
   * The `selector` argument should point to a `<select>` element.
   *
   * @param selector CSS selector which points to a `<select>` element.
   * @param value Value of `<option>` element.
   *
   * Suppose the HTML structure:
   *
   * ```html
   * <select>
   *   <option value="chino" />
   *   <option value="cocoa" />
   *   <option value="rize" selected />
   * </select>
   * ```
   *
   * ```javascript
   * const rize = new Rize()
   * rize.assertSelected('select', 'rize')
   * ```
   */
  assertSelected (selector: string, value: string) {
    return this
  }

  /**
   * Assert that the given `<option>` element has not been selected.
   *
   * The `selector` argument should point to a `<select>` element.
   *
   * @param selector CSS selector which points to a `<select>` element.
   * @param value Value of `<option>` element.
   *
   * Suppose the HTML structure:
   *
   * ```html
   * <select>
   *   <option value="chino" />
   *   <option value="cocoa" />
   *   <option value="rize" selected />
   * </select>
   * ```
   *
   * ```javascript
   * const rize = new Rize()
   * rize.assertNotSelected('select', 'chino')
   * ```
   */
  assertNotSelected (selector: string, value: string) {
    return this
  }

  /**
   * Assert that the given element is visible.
   *
   * @param selector CSS selector.
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.assertElementVisible('div')
   * ```
   */
  assertElementVisible (selector: string) {
    return this
  }

  /**
   * Assert that the given element is hidden.
   *
   * @param selector CSS selector.
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.assertElementHidden('div')
   * ```
   */
  assertElementHidden (selector: string) {
    return this
  }

  /**
   * Assert that the given element is present, though it is not visible.
   *
   * @param selector CSS selector.
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.assertElementPresent('div')
   * ```
   */
  assertElementPresent (selector: string) {
    return this
  }

  /**
   * Assert that the given element is missing.
   *
   * @param selector CSS selector.
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.assertElementMissing('.nope')
   * ```
   */
  assertElementMissing (selector: string) {
    return this
  }

  /* assertions END */

  /* actions START */

  /**
   * Click an element.
   *
   * @param selector CSS selector.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.click('button')
   * ```
   */
  click (selector: string) {
    return this
  }

  /**
   * Double click an element.
   *
   * @param selector CSS selector.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.doubleClick('button')
   * ```
   */
  doubleClick (selector: string) {
    return this
  }

  /**
   * Right click an element.
   *
   * @param selector CSS selector.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.rightClick('body')
   * ```
   */
  rightClick (selector: string) {
    return this
  }

  /**
   * Hover on an element.
   *
   * @param selector CSS selector.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.hover('a')
   * ```
   */
  hover (selector: string) {
    return this
  }

  /**
   * Type some text on an element.
   *
   * This method won't clear existing value of an element and
   * it only will append the given text.
   *
   * @param selector CSS selector.
   * @param text Text to be typed.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.type('input', 'text')
   * ```
   */
  type (selector: string, text: string) {
    return this
  }

  /**
   * Clear value of `<input>` element or text content of `<textarea>` element.
   *
   * @param selector CSS selector.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.clear('input')
   * rize.clear('textarea')
   * ```
   */
  clear (selector: string) {
    return this
  }

  /**
   * Focus on an element.
   *
   * @param selector CSS selector.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.focus('a')
   * ```
   */
  focus (selector: string) {
    return this
  }

  /**
   * Select one or more values on an `<select>` element.
   *
   * @param selector CSS selector.
   * @param values Values you want to choose, which can be one or more.
   *
   * @example
   *
   * Suppose the HTML structure:
   *
   * ```html
   * <body>
   *   <select id="single">
   *     <option>rize</option>
   *     <option selected>syaro</option>
   *   </select>
   *   <select multiple="multiple" id="multiple">
   *     <option>rize</option>
   *     <option>chino</option>
   *     <option>cocoa</option>
   *   </select>
   * </body>
   * ```
   *
   * ```javascript
   * const rize = new Rize()
   * rize.select('#single', 'rize')  // Single choice
   * rize.select('#multiple', ['chino', 'rize'])  // Multiple choices
   * ```
   */
  select (selector: string, values: string | string[]) {
    return this
  }

  /**
   * Check the given checkbox.
   *
   * @param selector CSS selector.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.check('input[type="checkbox"]')
   * ```
   */
  check (selector: string) {
    return this
  }

  /**
   * Uncheck the given checkbox.
   *
   * @param selector CSS selector.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.uncheck('input[type="checkbox"]')
   * ```
   */
  uncheck (selector: string) {
    return this
  }

  /**
   * Select the given value of a radio button field.
   *
   * @param selector CSS selector.
   * @param value Value of the radio button.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.radio('input[name="who"]', 'you')
   * ```
   */
  radio (selector: string, value: string) {
    return this
  }

  /* tslint:disable max-line-length */
  /**
   * Press a key to the page or an element by the given selector.
   *
   * @param key Key name.
   * @param selector CSS selector.
   *
   * @see https://github.com/GoogleChrome/puppeteer/blob/master/lib/USKeyboardLayout.js
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.press('a')  // This will send key `a` to page.
   * rize.press('a', 'div')  // This will send key `a` to an element.
   * ```
   */
  /* tslint:enable max-line-length */
  press (key: string, selector?: string) {
    return this
  }

  /* tslint:disable max-line-length */
  /**
   * Dispatches a keydown event.
   *
   * @param key Key name.
   *
   * @see https://github.com/GoogleChrome/puppeteer/blob/master/lib/USKeyboardLayout.js
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.keyDown('a')
   * ```
   */
  /* tslint:enable max-line-length */
  keyDown (key: string) {
    return this
  }

  /* tslint:disable max-line-length */
  /**
   * Dispatches a keyup event.
   *
   * @param key Key name.
   *
   * @see https://github.com/GoogleChrome/puppeteer/blob/master/lib/USKeyboardLayout.js
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.keyUp('a')
   * ```
   */
  /* tslint:enable max-line-length */
  keyUp (key: string) {
    return this
  }

  /**
   * Move mouse to the given coordinate.
   *
   * @param x
   * @param y
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.mouseMoveTo(1, 1)
   * ```
   */
  mouseMoveTo (x: number, y: number) {
    return this
  }

  /* tslint:disable max-line-length */
  /**
   * Click a mouse button at given coordinate.
   *
   * @see https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#mouseclickoptions
   *
   * @param x
   * @param y
   * @param options `puppeteer`'s mouse options.
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.mouseClick(1, 1)
   * rize.mouseClick(1, 1, { button: 'right' })
   * rize.mouseClick(1, 1, { clickCount: 2 })
   * rize.mouseClick(1, 1, { button: 'right', clickCount: 2 })
   * ```
   */
  /* tslint:enable max-line-length */
  mouseClick (x: number, y: number, options?: puppeteer.MousePressOptions) {
    return this
  }

  /**
   * Dispatches a `mousedown` event.
   *
   * @param button Mouse button. It can be `left`, 'right` or `middle`.
   * @param clickCount Click count.
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.mouseDown()
   * rize.mouseDown('middle')
   * rize.mouseDown('right')
   * rize.mouseDown('left', 2)
   * rize.mouseDown('right', 2)
   * ```
   */
  mouseDown (button: puppeteer.MouseButtons = 'left', clickCount: number = 1) {
    return this
  }

  /**
   * Dispatches a `mouseup` event.
   *
   * @param button Mouse button. It can be `left`, 'right` or `middle`.
   * @param clickCount Click count.
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.mouseUp()
   * rize.mouseUp('middle')
   * rize.mouseUp('right')
   * rize.mouseUp('left', 2)
   * rize.mouseUp('right', 2)
   * ```
   */
  mouseUp (button: puppeteer.MouseButtons = 'left', clickCount: number = 1) {
    return this
  }

  /**
   * Send a file by the given path to an element.
   *
   * @param selector CSS selector.
   * @param path Path to file.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.uploadFile('input[type="file"]', '/path/to/file')
   * ```
   */
  uploadFile (selector: string, path: string) {
    return this
  }

  /**
   * Add a class to an element.
   *
   * @param selector CSS selector.
   * @param className Class name.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.addClass('div', 'class-you-want-to-add')
   * ```
   */
  addClass (selector: string, className: string) {
    return this
  }

  /**
   * Remove an existing class
   *
   * @param selector CSS selector.
   * @param className Existing class name.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.removeClass('div', 'class-already-existed')
   * ```
   */
  removeClass (selector: string, className: string) {
    return this
  }

  /**
   * Toggle a class.
   * If the given class name is existed, it will be removed.
   * If the given class name is not existed, it will be added.
   *
   * @param selector CSS selector.
   * @param className Class name.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.toggleClass('div', 'class-name')
   * ```
   */
  toggleClass (selector: string, className: string) {
    return this
  }

  /**
   * Set cookie(s).
   *
   * @param cookies
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.setCookie({ name: 'name', value: 'value' })
   * ```
   */
  setCookie (...cookies: puppeteer.SetCookie[]) {
    return this
  }

  /**
   * Delete cookie(s).
   *
   * @param cookies
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.deleteCookie({ name: 'name' })
   * ```
   */
  deleteCookie (...cookies: puppeteer.DeleteCookie[]) {
    return this
  }

  /* actions END */

  /* retrieval START */

  /**
   * Retrieve the title of current page.
   *
   * @example
   *
   * ```javascript
   *
   * (async () => {
   *   const rize = new Rize()
   *   const title = await rize.title()
   * })()
   * ```
   */
  title () {
    return Promise.resolve('')
  }

  /**
   * Retrieve text content.
   *
   * @param selector CSS selector. Default is `body`.
   *
   * @example
   *
   * ```javascript
   *
   * (async () => {
   *   const rize = new Rize()
   *   const bodyText = await rize.text()
   *   const divText = await rize.text('div')
   * })()
   * ```
   */
  text (selector = 'body') {
    return Promise.resolve('')
  }

  /**
   * Retrieve *inner* HTML content.
   *
   * @param selector CSS selector. Default is `html`.
   *
   * @example
   *
   * ```javascript
   *
   * (async () => {
   *   const rize = new Rize()
   *   const html = await rize.html()
   *   const divHtml = await rize.html('div')
   * })()
   * ```
   */
  html (selector = 'html') {
    return Promise.resolve('')
  }

  /**
   * Retrieve an attribute of an element.
   *
   * @param selector CSS selector.
   * @param attribute Attribute name.
   * @returns Attribute value.
   *
   * @example
   *
   * ```javascript
   *
   * (async () => {
   *   const rize = new Rize()
   *   const classes = await rize.attribute('div', 'class')
   * })()
   * ```
   */
  attribute (selector: string, attribute: string): Promise<string | null> {
    return Promise.resolve('')
  }

  /**
   * Retrieve style value of an element.
   *
   * @param selector CSS selector.
   * @param property CSS property.
   *
   * @example
   *
   * ```javascript
   *
   * (async () => {
   *   const rize = new Rize()
   *   const value = await rize.style('div', 'font-size')
   * })()
   * ```
   */
  style (selector: string, property: string) {
    return Promise.resolve('')
  }

  /**
   * Retrieve value of an `<input>` element.
   *
   * @param selector CSS selector.
   *
   * @example
   *
   * ```javascript
   *
   * (async () => {
   *   const rize = new Rize()
   *   const value = await rize.value('input')
   * })()
   * ```
   */
  value (selector: string): Promise<string | null>

  /**
   * Set a value of an `<input>` element.
   *
   * @param selector CSS selector.
   * @param newValue New value.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.value('input', 'new-value')
   * ```
   */
  value (selector: string, newValue: string): this

  value (selector: string, newValue?: string): Promise<string | null> | this {
    return Promise.resolve('')
  }

  /**
   * Retrieve a boolean value indicates if an element has a given class name.
   *
   * @param selector CSS selector.
   * @param className Expected class name.
   *
   * @example
   *
   * ```javascript
   *
   * (async () => {
   *   const rize = new Rize()
   *   const exists = await rize.hasClass('div', 'pull-right')
   * })()
   * ```
   */
  hasClass (selector: string, className: string) {
    return Promise.resolve(false)
  }

  /**
   * Retrieve the URL of current page.
   *
   * @example
   *
   * ```javascript
   *
   * (async () => {
   *   const rize = new Rize()
   *   const url = await rize.url()
   * })()
   * ```
   */
  url () {
    return Promise.resolve('')
  }

  /**
   * Retrieve value of a key in query string.
   *
   * @param key Query string key.
   *
   * @example
   *
   * ```javascript
   *
   * (async () => {
   *   const rize = new Rize()
   *   const value = await rize.queryString('key')
   * })()
   * ```
   */
  queryString (key: string): Promise<string | string[] | undefined> {
    return Promise.resolve('')
  }

  /**
   * Retrieve cookie of current page.
   *
   * @example
   *
   * ```javascript
   *
   * (async () => {
   *   const rize = new Rize()
   *   const cookie = await rize.cookie()
   * })()
   * ```
   */
  cookie () {
    return Promise.resolve({} as puppeteer.Cookie)
  }

  /**
   * Retrieve cookies of current page.
   *
   * @example
   *
   * ```javascript
   *
   * (async () => {
   *   const rize = new Rize()
   *   const cookies = await rize.cookies()
   * })()
   * ```
   */
  cookies () {
    return Promise.resolve([] as puppeteer.Cookie[])
  }

  /**
   * Retrieve if an element is visible.
   *
   * @param selector CSS selector.
   *
   * @example
   *
   * ```javascript
   *
   * (async () => {
   *   const rize = new Rize()
   *   const isVisible = await rize.isVisible('div')
   * })()
   * ```
   */
  isVisible (selector: string) {
    return Promise.resolve(false)
  }

  /**
   * Retrieve if an element is present.
   *
   * @param selector CSS selector.
   *
   * @example
   *
   * ```javascript
   *
   * (async () => {
   *   const rize = new Rize()
   *   const isPresent = await rize.isPresent('div.nope')
   * })()
   * ```
   */
  isPresent (selector: string) {
    return Promise.resolve(false)
  }

  /**
   * Find an element by CSS selector and execute an operation.
   *
   * @param selector CSS selector.
   * @param fn One of available `Rize` APIs.
   * @returns Return value of the operation.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.find('button#greeting', rize.click)
   *
   * // or
   *
   * ;(async () => {
   *   const rize = new Rize()
   *   const text = await rize.find('span#greeting', rize.text)
   * })()
   * ```
   */
  find <T> (
    selector: string,
    fn: ((selector: string) => T)
  ): T

  /**
   * Find an element by CSS selector and execute an operation.
   *
   * @param selector CSS selector.
   * @param fn One of available `Rize` APIs.
   * @param arg1 The first argument of the operation.
   * @returns Return value of the operation.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.find('input#name', rize.type, 'my-name')
   *
   * // or
   *
   * ;(async () => {
   *   const rize = new Rize()
   *   const font = await rize.find('span#greeting', rize.style, 'font-size')
   * })()
   * ```
   */
  find <T, U1> (
    selector: string,
    fn: ((selector: string, arg1: U1) => T),
    arg1: U1
  ): T

  /**
   * Find an element by CSS selector and execute an operation.
   *
   * @param selector CSS selector.
   * @param fn One of available `Rize` APIs.
   * @param arg1 The first argument of the operation.
   * @param arg2 The second argument of the operation.
   * @returns Return value of the operation.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.find('div#message', rize.assertAttribute, 'id', 'message')
   * ```
   */
  find <T, U1, U2> (
    selector: string,
    fn: ((selector: string, arg1: U1, arg2: U2) => T),
    arg1: U1,
    arg2: U2
  ): T

  find <T> (
    selector: string,
    fn: ((selector: string, ...args) => T),
    ...args
  ): T {
    return fn('')
  }

  /**
   * Find all elements by CSS selector and pick one to execute an operation.
   *
   * @param selector CSS selector.
   * @param index Starts from 0.
   * @param fn One of available `Rize` APIs.
   * @returns Return value of the operation.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.findAll('button', 2, rize.click)
   *
   * // or
   *
   * ;(async () => {
   *   const rize = new Rize()
   *   const text = await rize.findAll('span', 2, rize.text)
   * })()
   * ```
   */
  findAll <T> (
    selector: string,
    index: number,
    fn: ((selector: string) => T)
  ): T

  /**
   * Find all elements by CSS selector and pick one to execute an operation.
   *
   * @param selector CSS selector.
   * @param index Starts from 0.
   * @param fn One of available `Rize` APIs.
   * @param arg1 The first argument of the operation.
   * @returns Return value of the operation.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.findAll('input', 1, rize.type, 'my-name')
   *
   * // or
   *
   * ;(async () => {
   *   const rize = new Rize()
   *   const font = await rize.findAll('span', 1, rize.style, 'font-size')
   * })()
   * ```
   */
  findAll <T, U1> (
    selector: string,
    index: number,
    fn: ((selector: string, arg1: U1) => T),
    arg1: U1
  ): T

  /**
   * Find all elements by CSS selector and pick one to execute an operation.
   *
   * @param selector CSS selector.
   * @param index Starts from 0.
   * @param fn One of available `Rize` APIs.
   * @param arg1 The first argument of the operation.
   * @param arg2 The second argument of the operation.
   * @returns Return value of the operation.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.findAll('div', 2, rize.assertAttribute, 'id', 'message')
   * ```
   */
  findAll <T, U1, U2> (
    selector: string,
    index: number,
    fn: ((selector: string, arg1: U1, arg2: U2) => T),
    arg1: U1,
    arg2: U2
  ): T

  findAll <T> (
    selector: string,
    index: number,
    fn: ((selector: string, ...args) => T),
    ...args
  ): T {
    return fn('')
  }

  /**
   * Find all elements by XPath and pick one to execute an operation.
   *
   * @param expression XPath expression.
   * @param index Starts from 0.
   * @param fn One of available `Rize` APIs.
   * @returns Return value of the operation.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.findByXPath('/html/body//div', 2, rize.click)
   *
   * // or
   *
   * ;(async () => {
   *   const rize = new Rize()
   *   const text = await rize.findByXPath('/html/body//span', 2, rize.text)
   * })()
   * ```
   */
  findByXPath <T> (
    expression: string,
    index: number,
    fn: ((selector: string) => T)
  ): T

  /**
   * Find all elements by XPath and pick one to execute an operation.
   *
   * @param expression XPath expression.
   * @param index Starts from 0.
   * @param fn One of available `Rize` APIs.
   * @param arg1 The first argument of the operation.
   * @returns Return value of the operation.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.findByXPath('/html/body//input', 1, rize.type, 'my-name')
   *
   * // or
   *
   * ;(async () => {
   *   const rize = new Rize()
   *   const font = await rize.findByXPath(
   *     '/html/body//span',
   *     1,
   *     rize.style,
   *     'font-size'
   *   )
   * })()
   * ```
   */
  findByXPath <T, U1> (
    expression: string,
    index: number,
    fn: ((selector: string, arg1: U1) => T),
    arg1: U1
  ): T

  /**
   * Find all elements by XPath and pick one to execute an operation.
   *
   * @param expression XPath expression.
   * @param index Starts from 0.
   * @param fn One of available `Rize` APIs.
   * @param arg1 The first argument of the operation.
   * @param arg2 The second argument of the operation.
   * @returns Return value of the operation.
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.findByXPath(
   *   '/html/body//div',
   *   2,
   *   rize.assertAttribute,
   *   'id',
   *   'message'
   * )
   * ```
   */
  findByXPath <T, U1, U2> (
    expression: string,
    index: number,
    fn: ((selector: string, arg1: U1, arg2: U2) => T),
    arg1: U1,
    arg2: U2
  ): T

  findByXPath <T> (
    expression: string,
    index: number,
    fn: ((selector: string, ...args) => T),
    ...args
  ): T {
    return fn('')
  }

  /**
   * Retrieval viewport information.
   *
   * @example
   *
   * ```javascript
   *
   * (async () => {
   *   const rize = new Rize()
   *   const viewport = await rize.viewport()
   * })()
   * ```
   */
  viewport () {
    return Promise.resolve({} as puppeteer.Viewport)
  }

  /* retrieval END */
}

/**
 * @private
 */
function mixin (main: typeof Rize, modules: any[]) {
  modules.forEach(module => {
      Object.getOwnPropertyNames(module.prototype).forEach(name => {
          main.prototype[name] = module.prototype[name]
      })
  })
}

mixin(Rize, [
  Actions,
  Assertions,
  Basic,
  Page,
  Retrieval
])

// @ts-ignore. This is for compatibility with CommonJS users.
export = Rize
