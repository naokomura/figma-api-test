const TOKEN = '9dd51c3cfc27d8cfc3ee38c8ace133456d304af6'

const request = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${TOKEN}`
  }
})

const issues = []
const test = document.getElementById('test')

const callback = () => {
  request
    .get('/issues', {
      params: {
        state: 'all',
        since: new Date('2018-01-01'),
        per_page: 1
      }
    })
    .then(res => getIssuesRecursively(res))
    .then(console.log(issues))

  function getIssuesRecursively(res) {
    issues.push(...res.data)
    if (!res.headers.link) return issues
    const next = parseLinkHeader(res.headers.link).next
    if (!next) return issues
    return request.get(next).then(res => getIssuesRecursively(res))
  }

  function parseLinkHeader(linkHeader) {
    return linkHeader.split(',').reduce((ret, linkStr) => {
      const [_, url, __, rel] = linkStr.match(/<(.*?)>;\s?(rel="(.*?)")?/)
      if (rel) ret[rel] = url
      return ret
    }, {})
  }
}

callback.addEventListener('load', () => (test.textContent = issues))
