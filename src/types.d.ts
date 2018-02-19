import puppeteer from 'puppeteer'

declare class Rize {
  browser: puppeteer.Browser
  page: puppeteer.Page

  constructor (options?: puppeteer.LaunchOptions)

  push (fn: () => void | Promise<void>): void

  goto (url: string): this

  sleep (ms: number): this

  execute (fn: (args?: any[]) => void): this

  closePage (): this

  end (callback?: (args?: any[]) => void): void
}

export type RizeClass = typeof Rize
