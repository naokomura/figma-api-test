import './style.scss'

/* -----------------------------------
GET DATAS FROM FIGMA API
----------------------------------- */
import { getFullJson, getStyleNode } from './functions/getApiObjects'

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
const basicInfoArea = document.getElementById('js-basic-infos')
import generateBasicInfo from './functions/generateBasicInfos'

const colorStyleArea = document.getElementById('js-color-styles')
import generateColorStyle from './functions/generateColorStyles'

/* -----------------------------------
GET FILE_KEY USER SET
----------------------------------- */
import getFileKey from './fileKey'
const setFileKeyButton = document.getElementById('js-set-file-key')
const fileKeyInput = document.forms.get_file_key_form.file_key

async function checkFileInfo(FILE_KEY) {
  const fullData = await getFullJson(FILE_KEY)
  const basicInfoAreaChild = basicInfoArea.firstElementChild

  //If basicInfoArea has child, delete myself.
  if (basicInfoAreaChild) {
    basicInfoAreaChild.parentNode.removeChild(basicInfoAreaChild)
  }

  if (typeof fullData === 'string') {
    const alertMsg = document.createElement('p')
    alertMsg.appendChild(
      document.createTextNode(
        `Error! Check if there is a mistake in the File Key >${fullData}`
      )
    )
    basicInfoArea.appendChild(alertMsg)
  } else {
    const basicInfoNodes = generateBasicInfo(fullData)
    basicInfoArea.appendChild(basicInfoNodes)
  }
}

fileKeyInput.addEventListener('input', () => {
  if (fileKeyInput.validity.valid) {
    setFileKeyButton.disabled = false
  } else {
    setFileKeyButton.disabled = true
  }
})

setFileKeyButton.addEventListener('click', () => {
  const FILE_KEY = getFileKey(fileKeyInput)
  //generate basic infos by gotten FILE_KEY
  checkFileInfo(FILE_KEY)
})

/* -----------------------------------
START ALL FUNCTION
----------------------------------- */
async function start() {
  //GET Full json
  const fullData = await getFullJson()
  const basicInfoNodes = generateBasicInfo(fullData)
  basicInfoArea.appendChild(basicInfoNodes)

  const styleAccessKeys = getStyleAccessKeys(fullData)
  console.log(styleAccessKeys)

  //GET Styles Node
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

  const colorStyleNodes = await generateColorStyle(colorStyleData)
  colorStyleArea.appendChild(colorStyleNodes)
}

//start()
