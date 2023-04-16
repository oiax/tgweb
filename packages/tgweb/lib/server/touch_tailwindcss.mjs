import * as PATH from "path"
import fs from "fs"

const touchTailwindcss = () => {
  const targetDirPath = PATH.join(process.cwd(), "dist", "css")
  const destPath = PATH.join(process.cwd(), "dist", "css", "tailwind.css")
  if (fs.existsSync(destPath)) return;

  fs.mkdirSync(targetDirPath, { recursive: true })
  fs.writeFileSync(destPath, "")
}

export { touchTailwindcss }
