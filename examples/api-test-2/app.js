const API_ROOT = 'https://codegrid-drill-06.netlify.com'

async function main() {
  const items = await fetch(`${API_ROOT}/list.json`).then(res => res.json())

  for (const item of items) {
    const data = await fetch(`${API_ROOT}/items/${item.id}.json`).then(res =>
      res.json()
    )
    console.log(`${data.name}: ${data.weight}`)
  }
}

main()
