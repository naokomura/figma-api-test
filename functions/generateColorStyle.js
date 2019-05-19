import rgbHex from 'rgb-hex'

function generateColorStyle(colorData) {
  const map = new Map()

  for (const item of Object.keys(colorData)) {
    let rgba = []
    let hex
    let colorCode
    let hexColorCode
    let sassVariable

    const colorName = colorData[item].name

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
    const colorSampleNode = document.createElement('div')
    const colorNameNode = document.createElement('h2')
    const rgbaCodeNode = document.createElement('p')
    const sassVariableNode = document.createElement('p')
    const sassVariableCodeNode = document.createElement('span')

    wrapBoxNode.classList.add('box')

    //Setting Color Sample Box
    colorSampleNode.classList.add('color-sample')
    if (!hexColorCode) {
      colorSampleNode.style.background = colorCode
      wrapBoxNode.appendChild(colorSampleNode)
    } else {
      colorSampleNode.style.background = hexColorCode
      wrapBoxNode.appendChild(colorSampleNode)
    }

    //Setting Color Style Name
    colorNameNode.appendChild(document.createTextNode(colorName))
    wrapBoxNode.appendChild(colorNameNode)

    //Setting RGBA Color Code
    rgbaCodeNode.appendChild(document.createTextNode(colorCode))
    wrapBoxNode.appendChild(rgbaCodeNode)

    //Setting Sass Color Variable
    sassVariableNode.appendChild(document.createTextNode(`$${colorName}: `))
    if (!hexColorCode) {
      sassVariableCodeNode.appendChild(document.createTextNode(`${colorCode};`))
    } else {
      sassVariableCodeNode.appendChild(
        document.createTextNode(`${hexColorCode};`)
      )
    }
    sassVariableNode.appendChild(sassVariableCodeNode)
    wrapBoxNode.appendChild(sassVariableNode)

    const box = 'box' + item
    map.set(box, wrapBoxNode)
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
