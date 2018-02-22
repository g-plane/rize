import EventEmitter from 'events'
import puppeteer from 'puppeteer'
import mixinBasic from './basic'
import mixinPage from './page'
import mixinAssertions from './assertions'
import mixinActions from './actions'

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
   * @param {any} args Arguments of the functions.
   * @memberof RizeOptions
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize({
   *   afterLaunched () {
   *     console.log('The browser has launched.')
   *   }
   * })
   * ```
   */
  afterLaunched? (...args): void
}

export default class Rize {
  private queue: symbol[] = []
  private eventBus = new EventEmitter()

  /**
   * Low-level instance of puppeteer's browser.
   *
   * @memberof Rize
   */
  public browser!: puppeteer.Browser

  /**
   * Low-level instance of puppeteer's current page.
   *
   * @memberof Rize
   */
  public page!: puppeteer.Page

  /**
   * Creates an instance of `Rize`.
   * @param {(puppeteer.LaunchOptions & RizeOptions)} [options={}]
   * @memberof Rize
   */
  constructor (options: puppeteer.LaunchOptions & RizeOptions = {}) {
    (async () => {
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
   * @returns
   * @memberof Rize
   * @private
   */
  push (fn: () => any) {
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

  /**
   * Clear the operations queue.
   *
   * @returns
   * @memberof Rize
   */
  clearQueue () {
    this.push(() => (this.queue = []))

    return this
  }

  /**
   * Clear the operations queue **RIGHT NOW**.
   *
   * @returns
   * @memberof Rize
   */
  clearQueueNow () {
    this.queue = []

    return this
  }

  /* basic START */

  /**
   * Sleep and wait for a time.
   *
   * @param {number} ms Time to sleep. The unit is millisecond.
   * @returns
   * @memberof Rize
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
   * Set the give user agent string.
   *
   * @param {string} userAgent The user agent string you want to use.
   * @returns
   * @memberof Rize
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

  /**
   * Execute a function.
   *
   * NOTE: the function will be executed in Node environment, not in browser.
   *
   * When you use `function` keyword (not arrow function),
   * `this` context in the function points to current `Rize` instance.
   *
   * @param fn The function to be execute.
   * @returns
   * @memberof Rize
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
   * Close current page, but it doesn't exit the browser.
   *
   * **You cannot visit the page any more!**
   *
   * @returns
   * @memberof Rize
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

  /**
   * Exit browser.
   * You can pass a callback,
   * and the callback will be called after browser exited.
   *
   * @param {(...args) => any} [callback]
   * @memberof Rize
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
   * @param {string} url URL to be navigated.
   * @returns
   * @memberof Rize
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

  /* tslint:disable max-line-length */
  /**
   * Go forward.
   *
   * @param {puppeteer.NavigationOptions} [options]
   * @returns
   * @memberof Rize
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
   * @param {puppeteer.NavigationOptions} [options]
   * @returns
   * @memberof Rize
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
   * @param {puppeteer.NavigationOptions} [options]
   * @returns
   * @memberof Rize
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

  /* tslint:disable max-line-length */
  /**
   * Save a screenshot of current page.
   *
   * @param {string} path Path to screenshot file.
   * @param {puppeteer.ScreenshotOptions} [options]
   * @returns
   * @memberof Rize
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
   * @param {string} path Path to PDF file.
   * @param {puppeteer.PDFOptions} [options]
   * @returns
   * @memberof Rize
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

  /* page END */

  /* assertions START */

  /**
   * Assert that the current URL matches the given URL.
   *
   * @param {string} expected Expected URL.
   * @returns
   * @memberof Rize
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
   * Assert that the current path matches the given path.
   *
   * @param {string} expected Expected path.
   * @returns
   * @memberof Rize
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
   * @param {string} expected Expected string.
   * @returns
   * @memberof Rize
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
   * @param {string} title Expected title.
   * @returns
   * @memberof Rize
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
   * @param {string} title Expected string.
   * @returns
   * @memberof Rize
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
   * Assert that query string has the given key.
   *
   * You can pass a expected value as the second argument.
   * Then it will check the value of given key in query string.
   *
   * @param {string} key Expected key in query string.
   * @param {string} [value] Expected value of a key in query string.
   * @returns
   * @memberof Rize
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
   * @param {string} key Expected missing key.
   * @returns
   * @memberof Rize
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
   * Assert that the cookies of current page has the given name and value.
   *
   * You can pass a expected value as the second argument.
   * Then it will check the value of given name in cookies.
   *
   * @param {string} name Expected cookies name.
   * @param {string} [value] Expected cookies value.
   * @returns
   * @memberof Rize
   *
   * @example
   *
   * ```javascript
   *
   * const rize = new Rize()
   * rize.assertCookiesHas('name')
   * rize.assertCookiesHas('name', 'value')
   * ```
   */
  assertCookiesHas (name: string, value?: string) {
    return this
  }

  /**
   * Assert that the page contains the given text.
   *
   * Text created and rendered by JavaScript dynamically is acceptable.
   *
   * @param {string} text Expected text.
   * @returns
   * @memberof Rize
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
   * Assert that the given text can be found by the given selector.
   *
   * @param {string} selector CSS selector.
   * @param {string} text Expected text.
   * @returns
   * @memberof Rize
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
   * Assert that an element by the given selector has the given
   * attribute and value.
   *
   * @param {string} selector CSS selector.
   * @param {string} attribute Attribute name.
   * @param {string} value Expected value.
   * @returns
   * @memberof Rize
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
   * @param {string} selector CSS selector.
   * @param {string} className Expected class name.
   * @returns
   * @memberof Rize
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
   * rize.assertHasClass('div', 'rabbit-house')
   * ```
   */
  assertHasClass (selector: string, className: string) {
    return this
  }

  /**
   * Assert that an element has the given style.
   *
   * @param {string} selector CSS selector.
   * @param {string} attribute CSS attribute. Camel-case or kebab-case are OK.
   * @param {string} value CSS value.
   * @returns
   * @memberof Rize
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
   * rize.assertHasStyle('div', 'font-size', '5px')
   * rize.assertHasStyle('div', 'fontSize', '5px')
   * ```
   */
  assertHasStyle (selector: string, attribute: string, value: string) {
    return this
  }

  /* assertions END */

  /* actions START */

  /**
   * Click an element.
   *
   * @param {string} selector CSS selector.
   * @returns
   * @memberof Rize
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
   * @param {string} selector CSS selector.
   * @returns
   * @memberof Rize
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
   * @param {string} selector CSS selector.
   * @returns
   * @memberof Rize
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
   * @param {string} selector CSS selector.
   * @returns
   * @memberof Rize
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
   * @param {string} selector CSS selector.
   * @param {string} text Text to be typed.
   * @returns
   * @memberof Rize
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
   * Focus on an element.
   *
   * @param {string} selector CSS selector.
   * @returns
   * @memberof Rize
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
   * @param {string} selector CSS selector.
   * @param {(string | string[])} values Values, which can be one or more.
   * @returns
   * @memberof Rize
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

  /* tslint:disable max-line-length */
  /**
   * Press a key to the page or an element by the given selector.
   *
   * @param {string} key Key name.
   * @param {string} [selector] CSS selector.
   * @returns
   * @memberof Rize
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
   * @param {string} key Key name.
   * @returns
   * @memberof Rize
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
   * @param {string} key Key name.
   * @returns
   * @memberof Rize
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
   * Send a file by the given path to an element.
   *
   * @param {string} selector CSS selector.
   * @param {string} path Path to file.
   * @returns
   * @memberof Rize
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

  /* actions END */
}

mixinBasic(Rize)
mixinPage(Rize)
mixinAssertions(Rize)
mixinActions(Rize)
