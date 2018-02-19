import http from 'http'

export default function createServer () {
  return http.createServer((request, response) => {
    response.end('testing')
  }).listen(4321)
}
