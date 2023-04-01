import assert from "node:assert/strict"
import { generateTailwindConfig } from "../../lib/tgweb/generate_tailwind_config.mjs"
import * as PATH from "path"
import { fileURLToPath } from "url";

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

describe("generateTailwindConfig", () => {
  it("generate tailwind_config.js", () => {
    const srcDir = PATH.resolve(__dirname, "../sites/site_0/src")
    const config = generateTailwindConfig(srcDir)

    const expected = `/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

delete colors.lightBlue
delete colors.warmGray
delete colors.trueGray
delete colors.coolGray
delete colors.blueGray

const customColors = {
  'pri-s': '#edce77',
  'sec-s': '#dfed77',
  'acc-s': '#77ede5',
  'neu-s': '#b5b5b5',
  'bas-s': '#ffffff',
  'nav-s': '#222222'
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
    assert.equal(config, expected)
  })
})
