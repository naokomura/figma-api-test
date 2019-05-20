//GET Style Images
async function getStyleImage(styleId) {
  const reqJson = await request.get(`/v1/images/${fileKey}`, {
    params: {
      ids: styleId
    }
  })
  const reqData = reqJson.data
  const styleData = reqData.nodes[styleId].document
  return styleData
}

export default getStyleImage
