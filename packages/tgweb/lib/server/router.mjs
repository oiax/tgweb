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

  router.get("/css/tailwind.css", (req, res) => {
    res.sendFile(path.join(documentRoot, req.path))
  })

  router.get(/^\/images\/.*\.(gif|png|jpe?g|svg|avif)$/, (req, res) => {
    res.sendFile(path.join(documentRoot, req.path))
  })

  router.get(/^\/audios\/.*\.(mp3|wav)$/, (req, res) => {
    res.sendFile(path.join(documentRoot, req.path))
  })

  return router
}

export { getRouter }
