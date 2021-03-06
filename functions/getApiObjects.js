import TOKEN from '../token'
import axios from 'axios'

const request = axios.create({
  baseURL: 'https://api.figma.com',
  headers: {
    'X-Figma-Token': `${TOKEN}`
  }
})

//API request Sleep
function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/* -----------------------------------
GET DATAS FROM FIGMA API
----------------------------------- */
//GET Full json
async function getFullJson(FILE_KEY) {
  try {
    const reqJson = await request.get(`/v1/files/${FILE_KEY}`)
    const reqData = reqJson.data
    return reqData
  } catch (error) {
    const { status, err } = error.response.data
    const errorMsg = `HTTP Status: ${status} ${err}`
    return errorMsg
  }
}

//GET Style Node
async function getStyleNode(styleId) {
  const reqJson = await request.get(`/v1/files/${FILE_KEY}/nodes`, {
    params: {
      ids: styleId
    }
  })
  const reqData = reqJson.data
  const styleData = reqData.nodes[styleId].document

  await timeout(100)
  return styleData
}

//GET Style Images
async function getStyleImage(styleId) {
  const reqJson = await request.get(`/v1/images/${FILE_KEY}`, {
    params: {
      ids: styleId
    }
  })
  const reqData = reqJson.data
  const styleData = reqData.images[styleId]

  await timeout(100)
  return styleData
}

export { getFullJson, getStyleNode, getStyleImage }
