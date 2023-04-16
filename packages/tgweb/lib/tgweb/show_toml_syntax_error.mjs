const NUMBER_OF_LINES = 5

const showTomlSytaxError = (path, tomlSource, error) => {
  const lines = tomlSource.split("\n")

  console.error(`Found a syntax error in the front matter block: ${path}`)
  console.error("-".repeat(77))

  if (error.line <= NUMBER_OF_LINES) {
    for (let i = 0; i <= error.line - 1; i++) {
      console.error(getLineNumber(i + 1) + lines[i])
    }
  }
  else {
    console.error("...")
    for (let i = error.line - NUMBER_OF_LINES; i <= error.line - 1; i++) {
      console.error(getLineNumber(i + 1) + lines[i])
    }
  }

  console.error(" ".repeat(error.column + 4) + "^")
  console.error("-".repeat(77))
}

const getLineNumber = (n) => String(n).padStart(3) + ": "

export { showTomlSytaxError }
