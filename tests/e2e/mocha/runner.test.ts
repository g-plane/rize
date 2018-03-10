import execa from 'execa'

test('Mocha success example', () => {
  const execution = execa.sync('node', [
    './node_modules/.bin/mocha',
    '--require',
    'ts-node/register',
    'tests/e2e/mocha/success.fixture.ts'
  ])
  expect(execution.code).toBe(0)
})

test('Mocha failed example', () => {
  expect.assertions(3)
  try {
    execa.sync('node', [
      './node_modules/.bin/mocha',
      '--require',
      'ts-node/register',
      'tests/e2e/mocha/failed.fixture.ts'
    ])
  } catch (error) {
    expect(error.code).not.toBe(0)
    expect(error.stdout.includes('-about:blank')).toBe(true)
    expect(error.stdout.includes('+url')).toBe(true)
  }
})
