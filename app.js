import TOKEN from './token'
import axios from 'axios'
import './style.scss'
import { async } from 'q'

const renderingArea = document.getElementById('js-rendering-area')
const fileKey = 'gzKK9ljJaDb9yRfJ2miGlQeh'

const request = axios.create({
  baseURL: 'https://api.figma.com',
  headers: {
    'X-Figma-Token': `${TOKEN}`
  }
})

//GET Full json
async function fileBasicInfo() {
  const reqJson = await request.get(`/v1/files/${fileKey}`)
  const reqData = reqJson.data
  return reqData
}

//GET Color Style Json
async function getColorStyle(colorKey) {
  const styleData = await function getColorStyle() {
    request.get(`/v1/styles/${colorKey.key}`)
  }

  return styleData
}

function getColorStyleKey(reqObj) {
  const styleData = reqObj.styles

  //Created Color(styleType === FILL) Key Object
  let colorKey = {}
  for (const id of Object.keys(styleData)) {
    if (styleData[id].styleType === 'FILL') {
      colorKey[id] = {
        key: styleData[id].key,
        name: styleData[id].name
      }
    }
  }

  return colorKey
}

function generateDom(reqObj) {
  console.log(reqObj)

  const fileTitle = document.createElement('h2')
  fileTitle.appendChild(document.createTextNode(`File Name: ${reqObj.name}`))
  const thumbnail = document.createElement('img')
  thumbnail.src = reqObj.thumbnailUrl

  const map = new Map()
  map.set('fileTitle', fileTitle)
  map.set('thumbnail', thumbnail)

  let generateDoms = document.createDocumentFragment()
  for (const item of map.values()) {
    generateDoms.appendChild(item)
  }
  return generateDoms
}

async function start() {
  const fullData = await fileBasicInfo()

  const dom = generateDom(fullData)
  renderingArea.appendChild(dom)

  const colorStyleKey = getColorStyleKey(fullData)

  let colorStyleData = {}
  for (const key of Object.keys(colorStyleKey)) {
    colorStyleData[key] = await getColorStyle(key)
  }

  console.log(colorStyleData)

  //test----
  // const testData = await fileStyles()
  // console.log(testData)
  //----test
}

start()
