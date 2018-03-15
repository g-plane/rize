# Contributing to Rize

First, thank you to contribute to Rize!

To contribute to Rize, you can write documentation (Yes! You don't need to write code!) and contribute code.

Before submitting your contribution, please make sure to take a moment and read through the following guidelines.

## Contributing to Documentation

You can help us to edit and polish the documentation, such as typos fixing and so on.

If you aren't reading the documentation in your native spoken language,
you can help us to translate the documentation!

All the documentation are written in Markdown.

There are two parts of documentation of Rize.

### The "Guide" Part

Documentation of the "Guide" part are put in `docs` directory. Different languages are in different directories.

### The "API" Part

The documentation of APIs are as comments in `src/index.ts` file.

Though the comments look like JSDoc, you don't need to specify the type of parameters and return value.
The TypeDoc and TypeScript compiler can infer their types and generate the types info to generated documentation.

Documentation of each API must provide an example about how to use this method.

## Technical Requirements

This project is written in TypeScript (including the tests files), so please **DO NOT** write JavaScript files.

If you are not familiar to TypeScript, you can read the [official documentation](https://www.typescriptlang.org/) of TypeScript.

## Development Setup

You need to install [Git](https://git-scm.com/), [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/).

The version of Node.js must be equal or greater than 6.4.0.

After cloning the repo, you should install the dependencies first:

```
$ yarn
```

## NPM Scripts

You can use the following scripts:

- `yarn build` - Build this project.
- `yarn build:docs` - Build the documentation.
- `yarn test` - Run unit tests.
- `yarn coverage` - Run unit tests and generate coverage report.
- `yarn test:e2e` - Run E2E tests.
- `yarn lint` - Lint the source files.

## Commit Messages

We use [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog).

### Quick Start

Install `cz-cli` globally. Then before you commit, run `git cz` instead of `git commit`.

### Format

The basic format of commit message is:

```
type(scope): short message

long message
```

### Type

`type` must be one of `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore` and `revert`.

When you submit a new feature, use `feat`.

When you fix a bug, use `fix`.

Anything about documentation, use `docs`.

For code style and linting, use `style`.

If you have refactored something, use `refactor`.

Something about building this project, use `build`.

Anything about continous integration, use `ci`.

For others like upgrading dependencies, update changelog and so on, use `chore`.
Note that if you upgraded dependencies, the scope must be `deps`.

Use `revert` to indicate you reverted something.

### Scope

It is determined by the category of Rize class you modified.

For example, you have modified the `actions.ts` file, the `scope` should be `actions`.

If you have modified something but it is hard to be classified, you can keep `scope` empty.

## Project Structure

### Directories

- `.circleci` - Circle CI v2 configuration files.
- `.github` - GitHub related documentation.
- `docs` - Documentation. ("Guide" part)
- `src` - Source code files.
- `tests` - Testing files.

### Source Code

The `index.ts` file just keeps the `Rize` class structure and does not contain the implementation.
This file just provide some type information.

There are several categories and each method must be in one and no more than one category,
such as `actions`, `assertions`, `basic`, `page` and `retrieval`.

If you want to propose a new method but you don't know which category is suitable,
feel free to open an issue and contact us.

Except the methods which will return some values for retrieving values,
other methods must return `this` to make API chainable and must use `prepareStackTrace` method
in the second argument of `push` method.
(Examples are in source code.)

### Unit Testing

All the unit tests files are suffixed `.test.ts`.

We use Jest as the test runner. In all tests files, please do not use `describe` block and `it` block.
Instead, you should use `test` block directly.

Test coverage should be keep 100% as possible.

## Code Style

This project use TSLint and `tslint-config-gplane`. Before you commit, please run `yarn lint`.

There are some additional code style requirements.

### `public` modifier

If the modifier of a method of a class is `public`, don't specify it explicitly.

Example:

You should do:

```typescript
assertUrlIs (expected: string) {
  //
}
```

You should not do:

```typescript
public assertUrlIs (expected: string) {
  //
}
```

### Type Annotation

If any variables, any parameters and return value can be inferred by the TypeScript compiler,
please do not annotate the type to keep code clean.
