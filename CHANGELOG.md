# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
- Remove `data-rize` attribute after calling `find` or `findAll` or `findByXPath` method.

## [0.5.0] - 2018-03-15
### Added
- New API: [`clickLink`](https://rize.js.org/api/classes/_index_.rize.html#clicklink)
- New API: [`assertHashIs`](https://rize.js.org/api/classes/_index_.rize.html#asserthashis)
- New API: [`assertHashBeginsWith`](https://rize.js.org/api/classes/_index_.rize.html#asserthashbeginswith)
- New option: [`browser`](https://rize.js.org/api/interfaces/_index_.rizeoptions.html#browser)
- New lifecycle hook: [`beforeEachStep`](https://rize.js.org/api/interfaces/_index_.rizeoptions.html#beforeeachstep)
- New lifecycle hook: [`afterEachStep`](https://rize.js.org/api/interfaces/_index_.rizeoptions.html#aftereachstep)
- Added a new parameter for [`html`](https://rize.js.org/api/classes/_index_.rize.html#html) method to determine retrieve inner or outer HTML.
### Changed
- Hooks now do not support passing arguments to function
### Fixed
- Fix that Jest shows assertion message twice.
- Fix missing `this` pointer of `beforeExit` hook.

## [0.4.0] - 2018-03-12
### Added
- New lifecycle hook: [`beforeExit`](https://rize.js.org/api/interfaces/_index_.rizeoptions.html#beforeexit)
### Changed
- Improved error stack trace

## [0.3.0] - 2018-03-08
### Added
- New option: `defaultNavigationTimeout`
- New API: [`findWithText`](https://rize.js.org/api/classes/_index_.rize.html#findwithtext)
### Changed
- Better assertions messages.

## [0.2.0] - 2018-03-06
### Added
- Multiple pages support.
- New API: [`newPage`](https://rize.js.org/api/classes/_index_.rize.html#newpage)
- New API: [`switchPage`](https://rize.js.org/api/classes/_index_.rize.html#switchpage)
- New API: [`pagesCount`](https://rize.js.org/api/classes/_index_.rize.html#pagescount)
### Changed
- [`closePage`](https://rize.js.org/api/classes/_index_.rize.html#closepage) supports closing a page with a given name.

## [0.1.0] - 2018-03-05
### Added
- Add all methods.
