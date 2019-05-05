const API_ROOT = 'https://codegrid-drill-06.netlify.com'

fetch(`${API_ROOT}/list.json`)
  .then(function(response) {
    return response.json()
  })
  .then(function(myJson) {
    console.log(myJson[0].name)
  })
