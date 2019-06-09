function generateBasicInfo(reqObj) {
  console.log(reqObj)

  const thumbnail = document.createElement('img')
  thumbnail.src = reqObj.thumbnailUrl

  const fileTitle = document.createElement('p')
  fileTitle.appendChild(document.createTextNode(`File Name: ${reqObj.name}`))
  const lastModified = document.createElement('p')
  lastModified.appendChild(
    document.createTextNode(`Last Modified: ${reqObj.lastModified}`)
  )

  const fileInfos = document.createElement('div')
  fileInfos.appendChild(fileTitle)
  fileInfos.appendChild(lastModified)

  const map = new Map()
  map.set('thumbnail', thumbnail)
  map.set('fileInfos', fileInfos)

  let generateDoms = document.createDocumentFragment()
  for (const item of map.values()) {
    generateDoms.appendChild(item)
  }

  return generateDoms
}

export default generateBasicInfo
