const TOKEN = '9dd51c3cfc27d8cfc3ee38c8ace133456d304af6'

const request = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${TOKEN}`
  }
})

request
  .get('/issues')
  .then(res => res.data)
  .then(console.log)
