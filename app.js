import TOKEN from './token'
import axios from 'axios'
import './style.scss'

const renderingArea = document.getElementById('js-rendering-area')
const fileKey = 'gzKK9ljJaDb9yRfJ2miGlQeh'

const request = axios.create({
  baseURL: 'https://api.figma.com',
  headers: {
    'X-Figma-Token': `${TOKEN}`
  }
})

//GET Figma Basic Informations
async function fileBasicInfo() {
  const reqJson = await request.get(`/v1/files/${fileKey}`)
  const reqData = reqJson.data
  return reqData
}

//GET Figma Test Json
async function dataCheck() {
  const reqJson = await request.get(`/v1/files/${fileKey}/nodes`, {
    params: {
      ids: '28:3'
    }
  })
  const reqData = reqJson.data
  return reqData
}

function generateDom(reqObj) {
  console.log(reqObj)

  const fileTitle = document.createElement('h2')
  fileTitle.appendChild(document.createTextNode(`File Name: ${reqObj.name}`))
  const thumbnail = document.createElement('img')
  thumbnail.src = reqObj.thumbnailUrl

  const generateObj = {
    fileTitle: fileTitle,
    thumbnail: thumbnail
  }

  let generateDoms = document.createDocumentFragment()
  for (const item of Object.keys(generateObj)) {
    generateDoms.appendChild(generateObj[item])
  }
  return generateDoms
}

async function start() {
  const res = await fileBasicInfo()
  const dom = generateDom(res)
  renderingArea.appendChild(dom)

  //test----
  const testData = await dataCheck()
  console.log(testData)
  //----test
}

start()
