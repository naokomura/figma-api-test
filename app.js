import TOKEN from './token'
import axios from 'axios'
import './style.scss'

const basicInfoArea = document.getElementById('js-basic-infos')
const colorStyleArea = document.getElementById('js-color-styles')
const fileKey = 'gzKK9ljJaDb9yRfJ2miGlQeh'

const request = axios.create({
  baseURL: 'https://api.figma.com',
  headers: {
    'X-Figma-Token': `${TOKEN}`
  }
})

/* -----------------------------------
GET DATAS FROM FIGMA API
----------------------------------- */
//GET Full json
async function getFullJson() {
  const reqJson = await request.get(`/v1/files/${fileKey}`)
  const reqData = reqJson.data
  return reqData
}

//GET Style Node
async function getStyleNode(styleId) {
  const reqJson = await request.get(`/v1/files/${fileKey}/nodes`, {
    params: {
      ids: styleId
    }
  })
  const reqData = reqJson.data
  const styleData = reqData.nodes[styleId].document
  return styleData
}

/* -----------------------------------
DATA EDITING & PREPARATION
----------------------------------- */
//Keys accessible all styleType Object
function getStyleAccessKeys(reqObj) {
  const styleData = reqObj.styles

  let colorKey = {}
  let i = 0
  for (const id of Object.keys(styleData)) {
    if (styleData[id].styleType === 'FILL') {
      colorKey[i] = {
        id: id,
        key: styleData[id].key
      }
      i++
    }
  }

  let effectKey = {}
  i = 0
  for (const id of Object.keys(styleData)) {
    if (styleData[id].styleType === 'EFFECT') {
      effectKey[i] = {
        id: id,
        key: styleData[id].key
      }
      i++
    }
  }

  let textKey = {}
  i = 0
  for (const id of Object.keys(styleData)) {
    if (styleData[id].styleType === 'TEXT') {
      textKey[i] = {
        id: id,
        key: styleData[id].key
      }
      i++
    }
  }

  const styleAccessKeys = {
    color: colorKey,
    effect: effectKey,
    text: textKey
  }

  return styleAccessKeys
}

/* -----------------------------------
GENERATE GETTING DATAS TO DOM
----------------------------------- */
function generateBasicInfo(reqObj) {
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

function generateColorStyle(colorData) {
  const map = new Map()

  for (const item of Object.keys(colorData)) {
    let colorNameNode = document.createElement('h2')
    let colorCodeNode = document.createElement('p')

    let rgba = []
    let colorCode

    if (colorData[item].fills[0].color) {
      let colorRgba = colorData[item].fills[0].color

      let colorAlpha
      if (colorData[item].fills[0].opacity) {
        colorAlpha = colorData[item].fills[0].opacity
      } else {
        colorAlpha = 1
      }

      for (const key of Object.keys(colorRgba)) {
        if (key === 'a') {
          let alpha = Math.round(colorAlpha * 100) / 100
          rgba.push(alpha)
        } else {
          let color = Math.round(colorRgba[key] * 255)
          rgba.push(color)
        }
      }

      colorCode = `rgba(${rgba.join()})`
    } else {
      console.log('gradient Color Style')
      colorCode = `linear-gradient(${rgba.join()})`
    }

    colorNameNode.appendChild(document.createTextNode(colorData[item].name))
    colorCodeNode.appendChild(document.createTextNode(colorCode))

    let name = 'name' + item
    let code = 'code' + item
    map.set(name, colorNameNode)
    map.set(code, colorCodeNode)
  }

  let generateDoms = document.createDocumentFragment()
  for (const item of map.values()) {
    generateDoms.appendChild(item)
  }

  return generateDoms
}

/* -----------------------------------
START ALL FUNCTION
----------------------------------- */
async function start() {
  const fullData = await getFullJson()
  const basicInfoNodes = generateBasicInfo(fullData)
  basicInfoArea.appendChild(basicInfoNodes)

  const styleAccessKeys = getStyleAccessKeys(fullData)
  console.log(styleAccessKeys)

  //Style Datas
  let colorStyleData = {}
  for (const id of Object.keys(styleAccessKeys.color)) {
    colorStyleData[id] = await getStyleNode(styleAccessKeys.color[id].id)
  }

  let effectStyleData = {}
  for (const id of Object.keys(styleAccessKeys.effect)) {
    effectStyleData[id] = await getStyleNode(styleAccessKeys.effect[id].id)
  }

  let textStyleData = {}
  for (const id of Object.keys(styleAccessKeys.text)) {
    textStyleData[id] = await getStyleNode(styleAccessKeys.text[id].id)
  }

  console.log(colorStyleData)
  console.log(effectStyleData)
  console.log(textStyleData)

  const colorStyleNodes = generateColorStyle(colorStyleData)
  colorStyleArea.appendChild(colorStyleNodes)

  //test----
  // const testData = await fileStyles()
  // console.log(testData)
  //----test
}

start()
