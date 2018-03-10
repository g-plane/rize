import Rize from '../../../src/index'

describe('Mocha test example', () => {
  it('this test should fail', async () => {
    const rize = new Rize()
    await rize
      .assertUrlIs('url')
      .end()
  })
})
