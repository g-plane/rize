import Rize from '../src'

test('call a function before browser launch', done => {
  const fn = jest.fn()
  const instance = new Rize({ beforeLaunch: fn })
  instance
    .execute(() => {
      expect(fn).toBeCalled()
    })
    .end(done)
}, 6000)

test('call a function after browser launched', done => {
  const fn = jest.fn()
  const instance = new Rize({ afterLaunched: fn })
  instance
    .execute(() => {
      expect(fn).toBeCalled()
    })
    .end(done)
})
