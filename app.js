import TOKEN from './token'
import axios from 'axios'

//style
import './style.scss'

console.log(TOKEN)

const request = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${TOKEN}`
  }
})

async function requestApi() {
  const reqJson = await request.get('/issues', {
    params: {
      state: 'all',
      since: new Date('2018-01-01'),
      per_page: 10
    }
  })
  const reqData = reqJson.data
  return reqData
}

function exportDom(reqObj) {
  const test = document.getElementById('test')
  for (const item of reqObj) {
    const h1 = document.createElement('h1')
    const p = document.createElement('p')
    h1.appendChild(document.createTextNode(item.title))
    p.appendChild(document.createTextNode(item.body))
    test.appendChild(h1)
    test.appendChild(p)
  }
  console.log(reqObj)
}

async function start() {
  const res = await requestApi()
  exportDom(res)
}

start()
