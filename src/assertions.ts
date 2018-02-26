import assert from 'assert'
import url from 'url'
import RizeInstance from './index'

export default function mixinAssertions (Rize: typeof RizeInstance) {
  Rize.prototype.assertUrlIs = function (expected: string) {
    this.push(() => assert.strictEqual(this.page.url(), expected))

    return this
  }

  Rize.prototype.assertPathIs = function (expected: string) {
    this.push(() => {
      const pageUrl = url.parse(this.page.url())
      assert.strictEqual(pageUrl.path, expected)
    })

    return this
  }

  Rize.prototype.assertPathBeginsWith = function (expected: string) {
    this.push(() => {
      const pageUrl = url.parse(this.page.url())
      assert.ok(
        pageUrl.path!.startsWith(expected),
        `Expected URL path starts with "${expected}".`
      )
    })

    return this
  }

  Rize.prototype.assertTitle = function (title: string) {
    this.push(async () => {
      assert.strictEqual(await this.page.title(), title)
    })

    return this
  }

  Rize.prototype.assertTitleContains = function (title: string) {
    this.push(async () => {
      const actual = await this.page.title()
      assert.ok(
        actual.includes(title),
        `Actual title does not contain "${title}".`
      )
    })

    return this
  }

  Rize.prototype.assertQueryStringHas = function (key: string, value?: string) {
    this.push(() => {
      const { query } = url.parse(this.page.url(), true)

      if (value) {
        assert.strictEqual(query[key], value)
      } else {
        assert.ok(
          key in query,
          `The key "${key}" cannot be found in query string.`
        )
      }
    })

    return this
  }

  Rize.prototype.assertQueryStringMissing = function (key: string) {
    this.push(() => {
      const { query } = url.parse(this.page.url(), true)

      assert.ok(!(key in query), `The key "${key}" was found in query string.`)
    })

    return this
  }

  Rize.prototype.assertCookiesHas = function (name: string, value?: string) {
    this.push(async () => {
      const cookies = (await this.page.cookies())[0]

      if (value) {
        const needed = { name: cookies.name, value: cookies.value }
        assert.deepStrictEqual(needed, { name, value })
      } else {
        assert.strictEqual(cookies.name, name)
      }
    })

    return this
  }

  Rize.prototype.assertSee = function (text: string) {
    this.push(async () => {
      const html = await this.page.content()
      assert.ok(html.includes(text), 'Text not found.')
    })

    return this
  }

  Rize.prototype.assertSeeIn = function (selector: string, text: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, 'Element not found.')
      const textContent: string = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel: string) => document.querySelector(sel)!.textContent,
        selector
      )
      assert.ok(textContent.includes(text), 'Text not found.')
    })

    return this
  }

  Rize.prototype.assertAttribute = function (
    selector: string,
    attribute: string,
    value: string
  ) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, 'Element not found.')
      const actual = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel: string, attr) => document.querySelector(sel)!.getAttribute(attr),
        selector, attribute
      )
      assert.strictEqual(actual, value)
    })

    return this
  }

  Rize.prototype.assertClassHas = function (
    selector: string,
    className: string,
  ) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, 'Element not found.')
      const result: boolean = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (
          sel: string,
          name
        ) => document.querySelector(sel)!.classList.contains(name),
        selector, className
      )
      assert.ok(result, `Element does not has "${className}" class.`)
    })

    return this
  }

  Rize.prototype.assertStyleHas = function (
    selector: string,
    property: string,
    value: string
  ) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, 'Element not found.')

      const actual = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, prop) => document
          .querySelector<HTMLElement>(sel)!
          .style.getPropertyValue(prop),
        selector,
        property
      )
      assert.strictEqual(actual, value)
    })

    return this
  }

  Rize.prototype.assertValueIs = function (selector: string, value: string) {
    this.push(async () => {
      const actual: string = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLInputElement>(sel)!.value,
        selector
      )
      assert.strictEqual(actual, value)
    })

    return this
  }

  Rize.prototype.assertValueIsNot = function (selector: string, value: string) {
    this.push(async () => {
      const actual: string = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLInputElement>(sel)!.value,
        selector
      )
      assert.notStrictEqual(actual, value)
    })

    return this
  }

  Rize.prototype.assertValueContains = function (
    selector: string,
    value: string
  ) {
    this.push(async () => {
      const actual: string = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLInputElement>(sel)!.value,
        selector
      )
      assert.ok(
        actual.includes(value),
        `Expected value contains "${value}", but not.`
      )
    })

    return this
  }

  Rize.prototype.assertChecked = function (selector: string) {
    this.push(async () => {
      const actual: boolean = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLInputElement>(sel)!.checked,
        selector
      )
      assert.ok(actual, 'The given checkbox have not been checked.')
    })

    return this
  }

  Rize.prototype.assertNotChecked = function (selector: string) {
    this.push(async () => {
      const actual: boolean = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLInputElement>(sel)!.checked,
        selector
      )
      assert.ok(!actual, 'The given checkbox have been checked.')
    })

    return this
  }

  Rize.prototype.assertRadioSelected = function (
    selector: string,
    value: string
  ) {
    this.push(async () => {
      const actual: boolean = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, val) => document
          .querySelector<HTMLInputElement>(`${sel}[value=${val}]`)!
          .checked,
        selector,
        value
      )
      assert.ok(actual, 'The given radio button have not been selected.')
    })

    return this
  }

  Rize.prototype.assertRadioNotSelected = function (
    selector: string,
    value: string
  ) {
    this.push(async () => {
      const actual: boolean = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, val) => document
          .querySelector<HTMLInputElement>(`${sel}[value=${val}]`)!
          .checked,
        selector,
        value
      )
      assert.ok(!actual, 'The given radio button have been selected.')
    })

    return this
  }

  Rize.prototype.assertSelected = function (selector: string, value: string) {
    this.push(async () => {
      const actual: boolean = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, val) => document
          .querySelector<HTMLSelectElement>(sel)!
          .querySelector<HTMLOptionElement>(`[value=${val}]`)!
          .selected,
        selector,
        value
      )
      assert.ok(actual, `The given value "${value}" have not been selected.`)
    })

    return this
  }

  Rize.prototype.assertNotSelected = function (
    selector: string,
    value: string
  ) {
    this.push(async () => {
      const actual: boolean = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel, val) => document
          .querySelector<HTMLSelectElement>(sel)!
          .querySelector<HTMLOptionElement>(`[value=${val}]`)!
          .selected,
        selector,
        value
      )
      assert.ok(!actual, `The given value "${value}" have been selected.`)
    })

    return this
  }

  Rize.prototype.assertElementVisible = function (selector: string) {
    this.push(async () => {
      const display: string = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLElement>(sel)!.style.display,
        selector
      )
      assert.notStrictEqual(display, 'none')
    })

    return this
  }

  Rize.prototype.assertElementPresent = function (selector: string) {
    this.push(async () => {
      const element: HTMLElement = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLElement>(sel),
        selector
      )
      assert.notEqual(element, null)
    })

    return this
  }

  Rize.prototype.assertElementMissing = function (selector: string) {
    this.push(async () => {
      const element: HTMLElement = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLElement>(sel),
        selector
      )
      assert.equal(element, null)
    })

    return this
  }
}
