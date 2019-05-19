function generateColorStyle(colorData) {
  const map = new Map()

  for (const item of Object.keys(colorData)) {
    let colorNameNode = document.createElement('h2')
    let colorCodeNode = document.createElement('p')

    let rgba = []
    let colorCode

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
    } else {
      console.log('gradient Color Style')

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

export default generateColorStyle
