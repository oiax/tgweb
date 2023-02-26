const err = (node, siteData, message) => {
  console.log(`Error: ${message}`)
  const errorDiv = siteData.documentTemplate.window.document.createElement("div")
  errorDiv.textContent = message
  errorDiv.style = "border: solid black 0.5rem; background-color: #800; color: #fee; padding: 1rem"
  node.before(errorDiv)
}

export { err }
