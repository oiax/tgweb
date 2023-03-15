import assert from "node:assert/strict"
import colors from "tailwindcss/colors.js"

delete colors.lightBlue
delete colors.warmGray
delete colors.trueGray
delete colors.coolGray
delete colors.blueGray

const keys = Object.keys(colors)

const specialPaletteNames = ["inherit", "current", "transparent", "black", "white"]

keys.forEach(key => {
  if (specialPaletteNames.includes(key)) return
  const palette = colors[key]
  assert(palette["50"])
})
