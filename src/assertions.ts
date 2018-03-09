import assert from 'assert'
import url from 'url'
import Infrastructure from './infrastructure'
import { prepareStackTrace } from './utils/error'

function greenify (text: string) {
  return `\u001B[32m${text}\u001B[39m`
}

function redify (text: string) {
  return `\u001B[31m${text}\u001B[39m`
}

export default class Assertions extends Infrastructure {
  assertUrlIs (expected: string) {
    this.push(() => assert.strictEqual(
      this.page.url(),
      expected,
      `Expected URL is "${greenify(expected)}", ` +
        `but received "${redify(this.page.url())}".`
    ), prepareStackTrace())

    return this
  }

  assertUrlMatch (regex: RegExp | string) {
    this.push(() => {
      const pageUrl = this.page.url()
      if (typeof regex === 'string') {
        assert.ok(
          new RegExp(regex).test(pageUrl),
          `Current URL "${redify(pageUrl)}" does not ` +
            `match "${greenify(regex)}".`
        )
      } else {
        assert.ok(
          regex.test(pageUrl),
          `Current URL "${redify(pageUrl)}" does not ` +
            `match "${greenify(regex.source)}".`
        )
      }
    }, prepareStackTrace())

    return this
  }

  assertPathIs (expected: string) {
    this.push(() => {
      const pageUrl = url.parse(this.page.url())
      assert.strictEqual(
        pageUrl.path,
        expected,
        `Expected path is "${greenify(expected)}", ` +
          `but received "${redify(pageUrl.path + '')}".`
      )
    }, prepareStackTrace())

    return this
  }

  assertPathBeginsWith (expected: string) {
    this.push(() => {
      const pageUrl = url.parse(this.page.url())
      assert.ok(
        pageUrl.path!.startsWith(expected),
        `Expected URL path starts with "${greenify(expected)}".`
      )
    }, prepareStackTrace())

    return this
  }

  assertTitle (title: string) {
    this.push(async () => {
      const actual = await this.page.title()
      assert.strictEqual(
        actual,
        title,
        `Expected page title is "${greenify(title)}", ` +
          `but received "${redify(actual)}".`
      )
    }, prepareStackTrace())

    return this
  }

  assertTitleContains (title: string) {
    this.push(async () => {
      const actual = await this.page.title()
      assert.ok(
        actual.includes(title),
        `Received title does not contain "${greenify(title)}".`
      )
    }, prepareStackTrace())

    return this
  }

  assertTitleMatch (regex: RegExp | string) {
    this.push(async () => {
      const title = await this.page.title()
      if (typeof regex === 'string') {
        assert.ok(
          new RegExp(regex).test(title),
          `Page title "${redify(title)}" does not match "${greenify(regex)}".`
        )
      } else {
        assert.ok(
          regex.test(title),
          `Page title "${redify(title)}" does not ` +
            `match "${greenify(regex.source)}".`
        )
      }
    }, prepareStackTrace())

    return this
  }

  assertQueryStringHas (key: string, value?: string) {
    this.push(() => {
      const { query } = url.parse(this.page.url(), true)

      if (value) {
        assert.strictEqual(
          query[key],
          value,
          `Expected value of the key "${key}" is "${greenify(value)}", ` +
            `but received "${redify(query[key] + '')}".`
        )
      } else {
        assert.ok(
          key in query,
          `The key "${greenify(key)}" cannot be found in query string.`
        )
      }
    }, prepareStackTrace())

    return this
  }

  assertQueryStringMissing (key: string) {
    this.push(() => {
      const { query } = url.parse(this.page.url(), true)

      assert.ok(
        !(key in query),
        `The key "${redify(key)}" was found in query string.`
      )
    }, prepareStackTrace())

    return this
  }

  assertCookieHas (name: string, value?: string) {
    this.push(async () => {
      const cookie = (await this.page.cookies())[0]

      if (value) {
        const actual = { name: cookie.name, value: cookie.value }
        const expected = { name, value }
        assert.deepStrictEqual(
          actual,
          expected,
          `Expected cookie is ${greenify(JSON.stringify(expected))}, ` +
            `but received ${redify(JSON.stringify(actual))}`
        )
      } else {
        assert.strictEqual(
          cookie.name,
          name,
          `Expected cookie "${greenify(name)}" cannot be found.`
        )
      }
    }, prepareStackTrace())

    return this
  }

  assertSee (text: string) {
    this.push(async () => {
      const html = await this.page.content()
      assert.ok(
        html.includes(text),
        `Expected text "${greenify(text)}" cannot be found.`
      )
    }, prepareStackTrace())

    return this
  }

  assertDontSee (text: string) {
    this.push(async () => {
      const html = await this.page.content()
      assert.ok(
        !html.includes(text),
        `Unexpected text "${redify(text)}" was found.`
      )
    }, prepareStackTrace())

    return this
  }

  assertSeeIn (selector: string, text: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)
      const textContent: string = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel: string) => document.querySelector(sel)!.textContent,
        selector
      )
      assert.ok(
        textContent.includes(text),
        `Expected text "${text}" cannot be found in element "${selector}".`
      )
    }, prepareStackTrace())

    return this
  }

  assertDontSeeIn (selector: string, text: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)
      const textContent: string = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel: string) => document.querySelector(sel)!.textContent,
        selector
      )
      assert.ok(
        !textContent.includes(text),
        `Unexpected text "${redify(text)}" was found in element "${selector}".`
      )
    }, prepareStackTrace())

    return this
  }

  assertAttribute (selector: string, attribute: string, value: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)
      const actual = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel: string, attr) => document.querySelector(sel)!.getAttribute(attr),
        selector, attribute
      )
      assert.strictEqual(
        actual,
        value,
        `Expected value of attribute "${attribute}" of element "${selector}" ` +
        `is "${greenify(value)}", but received "${redify(actual)}".`
      )
    }, prepareStackTrace())

    return this
  }

  assertClassHas (selector: string, className: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)
      const result: boolean = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (
          sel: string,
          name
        ) => document.querySelector(sel)!.classList.contains(name),
        selector, className
      )
      assert.ok(
        result,
        `Element "${selector}" does not has "${className}" class.`
      )
    }, prepareStackTrace())

    return this
  }

  assertClassMissing (selector: string, className: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)
      const result: boolean = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (
          sel: string,
          name
        ) => document.querySelector(sel)!.classList.contains(name),
        selector, className
      )
      assert.ok(
        !result,
        `Element "${selector}" has unexpected "${redify(className)}" class.`
      )
    }, prepareStackTrace())

    return this
  }

  assertStyleHas (selector: string, property: string, value: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)

      const actual = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, prop) => document
          .querySelector<HTMLElement>(sel)!
          .style.getPropertyValue(prop),
        selector,
        property
      )
      assert.strictEqual(
        actual,
        value,
        `Expected value of style property "${property}" of element ` +
          `"${selector}" is "${greenify(value)}", ` +
          `but received ${redify(actual)}.`
      )
    }, prepareStackTrace())

    return this
  }

  assertValueIs (selector: string, value: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)

      const actual: string = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLInputElement>(sel)!.value,
        selector
      )
      assert.strictEqual(
        actual,
        value,
        `Expected value of element "${selector}" is "${greenify(value)}", ` +
          `but received "${redify(actual)}".`
      )
    }, prepareStackTrace())

    return this
  }

  assertValueIsNot (selector: string, value: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)

      const actual: string = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLInputElement>(sel)!.value,
        selector
      )
      assert.notStrictEqual(
        actual,
        value,
        `Expected value of element "${selector}" is NOT "${greenify(value)}"` +
          `, but received "${redify(actual)}".`
      )
    }, prepareStackTrace())

    return this
  }

  assertValueContains (selector: string, value: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)

      const actual: string = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLInputElement>(sel)!.value,
        selector
      )
      assert.ok(
        actual.includes(value),
        `Expected value of element "${selector}" contains "${value}", but not.`
      )
    }, prepareStackTrace())

    return this
  }

  assertChecked (selector: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)

      const actual: boolean = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLInputElement>(sel)!.checked,
        selector
      )
      assert.ok(actual, `The checkbox "${selector}" has not been checked.`)
    }, prepareStackTrace())

    return this
  }

  assertNotChecked (selector: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)

      const actual: boolean = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLInputElement>(sel)!.checked,
        selector
      )
      assert.ok(!actual, `The checkbox "${selector}" has been checked.`)
    }, prepareStackTrace())

    return this
  }

  assertRadioSelected (selector: string, value: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)

      const actual: boolean = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, val) => document
          .querySelector<HTMLInputElement>(`${sel}[value=${val}]`)!
          .checked,
        selector,
        value
      )
      assert.ok(actual, `The radio button "${selector}" has not been selected.`)
    }, prepareStackTrace())

    return this
  }

  assertRadioNotSelected (selector: string, value: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)

      const actual: boolean = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, val) => document
          .querySelector<HTMLInputElement>(`${sel}[value=${val}]`)!
          .checked,
        selector,
        value
      )
      assert.ok(!actual, `The radio button "${selector}" has been selected.`)
    }, prepareStackTrace())

    return this
  }

  assertSelected (selector: string, value: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)

      const actual: boolean = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, val) => document
          .querySelector<HTMLSelectElement>(sel)!
          .querySelector<HTMLOptionElement>(`[value=${val}]`)!
          .selected,
        selector,
        value
      )
      assert.ok(
        actual,
        `The value "${value}" in element "${selector}" has not been selected.`
      )
    }, prepareStackTrace())

    return this
  }

  assertNotSelected (selector: string, value: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)

      const actual: boolean = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, val) => document
          .querySelector<HTMLSelectElement>(sel)!
          .querySelector<HTMLOptionElement>(`[value=${val}]`)!
          .selected,
        selector,
        value
      )
      assert.ok(
        !actual,
        `The value "${value}" in element "${selector}" has been selected.`
      )
    }, prepareStackTrace())

    return this
  }

  assertElementVisible (selector: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)

      const display: string = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLElement>(sel)!.style.display,
        selector
      )
      assert.notStrictEqual(
        display,
        'none',
        `The element "${selector}" is ${redify('NOT')} visible.`
      )
    }, prepareStackTrace())

    return this
  }

  assertElementHidden (selector: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, `Element "${selector}" cannot be found.`)

      const display: string = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLElement>(sel)!.style.display,
        selector
      )
      assert.strictEqual(
        display,
        'none',
        `The element "${selector}" is visible.`
      )
    }, prepareStackTrace())

    return this
  }

  assertElementPresent (selector: string) {
    this.push(async () => {
      const element: HTMLElement = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLElement>(sel),
        selector
      )
      assert.notEqual(
        element,
        null,
        `The element "${selector}" is ${redify('NOT')} present.`
      )
    }, prepareStackTrace())

    return this
  }

  assertElementMissing (selector: string) {
    this.push(async () => {
      const element: HTMLElement = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLElement>(sel),
        selector
      )
      assert.equal(
        element,
        null,
        `The element "${selector}" is present.`
      )
    }, prepareStackTrace())

    return this
  }
}
