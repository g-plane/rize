import assert from 'assert'
import url from 'url'
import Infrastructure from './infrastructure'

export default class Assertions extends Infrastructure {
  assertUrlIs (expected: string) {
    this.push(() => assert.strictEqual(this.page.url(), expected))

    return this
  }

  assertUrlMatch (regex: RegExp | string) {
    this.push(() => {
      const pageUrl = this.page.url()
      if (typeof regex === 'string') {
        assert.ok(
          new RegExp(regex).test(pageUrl),
          `Current URL "${pageUrl}" does not match "${regex}".`
        )
      } else {
        assert.ok(
          regex.test(pageUrl),
          `Current URL "${pageUrl}" does not match "${regex.source}".`
        )
      }
    })

    return this
  }

  assertPathIs (expected: string) {
    this.push(() => {
      const pageUrl = url.parse(this.page.url())
      assert.strictEqual(pageUrl.path, expected)
    })

    return this
  }

  assertPathBeginsWith (expected: string) {
    this.push(() => {
      const pageUrl = url.parse(this.page.url())
      assert.ok(
        pageUrl.path!.startsWith(expected),
        `Expected URL path starts with "${expected}".`
      )
    })

    return this
  }

  assertTitle (title: string) {
    this.push(async () => {
      assert.strictEqual(await this.page.title(), title)
    })

    return this
  }

  assertTitleContains (title: string) {
    this.push(async () => {
      const actual = await this.page.title()
      assert.ok(
        actual.includes(title),
        `Actual title does not contain "${title}".`
      )
    })

    return this
  }

  assertTitleMatch (regex: RegExp | string) {
    this.push(async () => {
      const title = await this.page.title()
      if (typeof regex === 'string') {
        assert.ok(
          new RegExp(regex).test(title),
          `Page title "${title}" does not match "${regex}".`
        )
      } else {
        assert.ok(
          regex.test(title),
          `Page title "${title}" does not match "${regex.source}".`
        )
      }
    })

    return this
  }

  assertQueryStringHas (key: string, value?: string) {
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

  assertQueryStringMissing (key: string) {
    this.push(() => {
      const { query } = url.parse(this.page.url(), true)

      assert.ok(!(key in query), `The key "${key}" was found in query string.`)
    })

    return this
  }

  assertCookieHas (name: string, value?: string) {
    this.push(async () => {
      const cookie = (await this.page.cookies())[0]

      if (value) {
        const needed = { name: cookie.name, value: cookie.value }
        assert.deepStrictEqual(needed, { name, value })
      } else {
        assert.strictEqual(cookie.name, name)
      }
    })

    return this
  }

  assertSee (text: string) {
    this.push(async () => {
      const html = await this.page.content()
      assert.ok(html.includes(text), 'Text not found.')
    })

    return this
  }

  assertDontSee (text: string) {
    this.push(async () => {
      const html = await this.page.content()
      assert.ok(!html.includes(text), 'Unexpected text found.')
    })

    return this
  }

  assertSeeIn (selector: string, text: string) {
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

  assertDontSeeIn (selector: string, text: string) {
    this.push(async () => {
      const element = await this.page.$(selector)
      assert.ok(element, 'Element not found.')
      const textContent: string = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        (sel: string) => document.querySelector(sel)!.textContent,
        selector
      )
      assert.ok(!textContent.includes(text), 'Unexpected text found.')
    })

    return this
  }

  assertAttribute (selector: string, attribute: string, value: string) {
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

  assertClassHas (selector: string, className: string) {
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

  assertClassMissing (selector: string, className: string) {
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
      assert.ok(!result, `Element has unexpected "${className}" class.`)
    })

    return this
  }

  assertStyleHas (selector: string, property: string, value: string) {
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

  assertValueIs (selector: string, value: string) {
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

  assertValueIsNot (selector: string, value: string) {
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

  assertValueContains (selector: string, value: string) {
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

  assertChecked (selector: string) {
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

  assertNotChecked (selector: string) {
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

  assertRadioSelected (selector: string, value: string) {
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

  assertRadioNotSelected (selector: string, value: string) {
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

  assertSelected (selector: string, value: string) {
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

  assertNotSelected (selector: string, value: string) {
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

  assertElementVisible (selector: string) {
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

  assertElementHidden (selector: string) {
    this.push(async () => {
      const display: string = await this.page.evaluate(
        /* istanbul ignore next, instrumenting cannot be executed in browser */
        sel => document.querySelector<HTMLElement>(sel)!.style.display,
        selector
      )
      assert.strictEqual(display, 'none', 'The given element is visible.')
    })

    return this
  }

  assertElementPresent (selector: string) {
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

  assertElementMissing (selector: string) {
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
