import Rize from '../../../src/index'

describe('Mocha test example', () => {
  it('this test should succeed', async () => {
    const rize = new Rize()
    await rize
      .assertUrlIs('about:blank')
      .end()
  })
})
