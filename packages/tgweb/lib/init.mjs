#! /usr/bin/env node

import path from "path"
import fs from "fs"
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetDir = process.cwd()

const filenames = ["tailwind.config.js", "tailwind.css"]

filenames.forEach(filename => {
  const src = path.resolve(__dirname, "../stubs/", filename)
  const dest = path.resolve(targetDir, filename)

  if (!fs.existsSync(dest)) fs.copyFileSync(src, dest)
})
