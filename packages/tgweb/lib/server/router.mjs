import express from "express"
import path from "path"

const getRouter = () => {
  const router = express.Router()
  const documentRoot = path.join(process.cwd(), "dist")

  router.get("/", (req, res) => {
    res.sendFile(path.join(documentRoot, "index.html"))
  })

  router.get("/*.html", (req, res) => {
    res.sendFile(path.join(documentRoot, req.path))
  })

  router.get("/css/*.css", (req, res) => {
    res.sendFile(path.join(documentRoot, req.path))
  })

  router.get("/js/*.js", (req, res) => {
    res.sendFile(path.join(documentRoot, req.path))
  })

  router.get("/css/**/*.css", (req, res) => {
    res.sendFile(path.join(documentRoot, req.path))
  })

  router.get("/css/**/*.woff2", (req, res) => {
    res.sendFile(path.join(documentRoot, req.path))
  })

  router.get(/^\/images\/.*\.(gif|png|jpe?g|svg|avif)$/, (req, res) => {
    res.sendFile(path.join(documentRoot, req.path))
  })

  router.get(/^\/images\/.*\.(svgz)$/, (req, res) => {
    res.setHeader("Content-encoding", "gzip")
    res.sendFile(path.join(documentRoot, req.path))
  })

  router.get(/^\/audios\/.*\.(mp3|wav)$/, (req, res) => {
    res.sendFile(path.join(documentRoot, req.path))
  })

  router.get(/^\/animations\/.*\.(json|lottie)$/, (req, res) => {
    res.sendFile(path.join(documentRoot, req.path))
  })

  router.get(/^\/.*\.(ico|png|svg)$/, (req, res) => {
    res.sendFile(path.join(documentRoot, req.path))
  })

  return router
}

export { getRouter }
