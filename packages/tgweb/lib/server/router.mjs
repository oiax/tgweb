import express from "express"
import path from "path"

const router = express.Router()
const documentRoot = path.join(process.cwd(), "dist")

router.get("/", function (req, res) {
  res.sendFile(path.join(documentRoot, "index.html"))
})

router.get("/*.html", function (req, res) {
  res.sendFile(path.join(documentRoot, req.path))
})

router.get("/css/tailwind.css", function (req, res) {
  res.sendFile(path.join(documentRoot, req.path))
})

router.get(/^\/images\/.*\.(gif|png|jpe?g|svg|avif)$/, function (req, res) {
  res.sendFile(path.join(documentRoot, req.path))
})

router.get(/^\/audios\/.*\.(mp3|wav)$/, function (req, res) {
  res.sendFile(path.join(documentRoot, req.path))
})

export default router
