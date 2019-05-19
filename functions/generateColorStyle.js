import rgbHex from 'rgb-hex'

function generateColorStyle(colorData) {
  const map = new Map()

  for (const item of Object.keys(colorData)) {
    let rgba = []
    let hex
    let colorCode
    let hexColorCode

    if (colorData[item].fills[0].color) {
      let colorRgb = colorData[item].fills[0].color
      let colorAlpha = colorData[item].fills[0].opacity

      if (!colorAlpha) {
        colorAlpha = 1
      }

      for (const key of Object.keys(colorRgb)) {
        if (key === 'a') {
          let alpha = Math.round(colorAlpha * 100) / 100
          rgba.push(alpha)
        } else {
          let color = Math.round(colorRgb[key] * 255)
          rgba.push(color)
        }
      }

      colorCode = `rgba(${rgba.join()})`

      //rgbHex Returned #01234567
      hex = rgbHex(colorCode)
      hexColorCode = `#${hex.substr(0, 6)}`
    } else {
      let gradientCode = []
      let gradientData = colorData[item].fills[0].gradientStops

      for (let i = 0; i < gradientData.length; i++) {
        let gradientRgb = gradientData[i].color
        let gradientAlpha = gradientData[i].opacity
        let gradientPos = gradientData[i].position

        if (!gradientAlpha) {
          gradientAlpha = 1
        }

        rgba = []

        for (const key of Object.keys(gradientRgb)) {
          if (key === 'a') {
            let alpha = Math.round(gradientAlpha * 100) / 100
            rgba.push(alpha)
          } else {
            let color = Math.round(gradientRgb[key] * 255)
            rgba.push(color)
          }
        }

        const colorPos = Math.round(gradientPos * 100)
        gradientCode.push(`rgba(${rgba.join()}) ${colorPos}%`)
      }
      colorCode = `linear-gradient(90deg,${gradientCode.join()})`
    }

    const wrapBoxNode = document.createElement('div')
    const colorNameNode = document.createElement('h2')
    const rgbaCodeNode = document.createElement('p')
    const hexCodeNode = document.createElement('p')

    wrapBoxNode.classList.add('box')

    colorNameNode.appendChild(document.createTextNode(colorData[item].name))
    wrapBoxNode.appendChild(colorNameNode)
    rgbaCodeNode.appendChild(document.createTextNode(colorCode))
    wrapBoxNode.appendChild(rgbaCodeNode)

    if (hexColorCode) {
      hexCodeNode.appendChild(document.createTextNode(hexColorCode))
      wrapBoxNode.appendChild(hexCodeNode)
    }

    const box = 'box' + item
    // const name = 'name' + item
    // const rgbCode = 'code' + item
    // const hexCode = 'hex' + item
    map.set(box, wrapBoxNode)
    // map.set(name, colorNameNode)
    // map.set(rgbCode, rgbaCodeNode)
    // map.set(hexCode, hexCodeNode)
  }

  const containerNode = document.createElement('div')
  containerNode.classList.add('container')

  for (const item of map.values()) {
    containerNode.appendChild(item)
  }

  let generateDoms = document.createDocumentFragment()
  generateDoms.appendChild(containerNode)

  return generateDoms
}

export default generateColorStyle
