import * as PATH from "path"
import fs from "fs"
import YAML from "js-yaml"

const template1 = `/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

delete colors.lightBlue
delete colors.warmGray
delete colors.trueGray
delete colors.coolGray
delete colors.blueGray

const customColors = {
`

const template2 = `
}

Object.assign(colors, customColors)

module.exports = {
  content: ["./dist/**/*.html"],
  theme: {
    extend: {},
    colors: colors
  },
  plugins: [require("daisyui")],
}
`

const paletteNames = ["pri", "sec", "acc", "neu", "bas", "nav"]
const modifiers = ["s", "b", "d", "c"]

const generateTailwindConfig = (srcDir) => {
  const colorSchemePath = PATH.resolve(PATH.join(srcDir, "color_scheme.yml"))

  if (fs.existsSync(colorSchemePath)) {
    const yamlData = fs.readFileSync(colorSchemePath)

    try {
      const doc = YAML.load(yamlData)

      const keys = Object.keys(doc).filter(key => {
        const parts = key.split("-")

        return parts.length == 2 && paletteNames.includes(parts[0]) &&
          modifiers.includes(parts[1])
      })

      const colors = keys.map(key => `'${key}': '${doc[key]}'`).join(",\n  ")

      return template1 + "  " + colors + template2
    }
    catch (e) {
      console.log(e)
    }
  }
  else {
    return template1 + template2
  }
}

export { generateTailwindConfig }
