const TOKEN = '9dd51c3cfc27d8cfc3ee38c8ace133456d304af6'

const request = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${TOKEN}`
  }
})

const issues = []
const test = document.getElementById('test')

async function requestApi() {
  const reqJson = await request.get('/issues', {
    params: {
      state: 'all',
      since: new Date('2018-01-01'),
      per_page: 10
    }
  })
  const reqData = await reqJson.data
  return reqData
}

async function exportDom() {
  const reqObj = await requestApi()

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

exportDom()
