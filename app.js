import TOKEN from './token'
import axios from 'axios'
import './style.scss'

const basicInfoArea = document.getElementById('js-basic-infos')
const colorStyleArea = document.getElementById('js-color-styles')

//helle Design System
// const fileKey = 'gzKK9ljJaDb9yRfJ2miGlQeh'
//MEME Design System
const fileKey = 'Yvk9kgOXwpFWZ71jXQLcZooH'

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
import generateColorStyle from './functions/generateColorStyle'

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
