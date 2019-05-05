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
  test.textContent = reqObj[0].id
}

exportDom()

// function getIssuesRecursively(res) {
//   issues.push(...res.data)
//   if (!res.headers.link) return issues
//   const next = parseLinkHeader(res.headers.link).next
//   if (!next) return issues
//   return request.get(next).then(res => getIssuesRecursively(res))
// }

// function parseLinkHeader(linkHeader) {
//   return linkHeader.split(',').reduce((ret, linkStr) => {
//     const [_, url, __, rel] = linkStr.match(/<(.*?)>;\s?(rel="(.*?)")?/)
//     if (rel) ret[rel] = url
//     return ret
//   }, {})
// }
