#! /usr/bin/env node

import * as PATH from "path"
import getopts from "getopts"
import child_process from "child_process"
const { exec } = child_process

const main = (targetDirPath, projectName) => {
  const command =
    `npx wrangler pages deploy ${targetDirPath}/dist ` +
      `--project-name ${projectName} --branch main --commit-dirty=true`

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err)
      return
    }

    console.log(stdout)
  })
}

const options = getopts(process.argv.slice(2))
const args = options["_"]

const targetDirName = args[0]

if (targetDirName == undefined) {
  console.log("Usage: npx tgweb-deploy <site-name>")
}
else {
  const projectName = targetDirName.replace(/^sites\//, "")
  const targetDirPath = PATH.resolve(process.cwd(), `./sites/${projectName}`)
  main(targetDirPath, projectName)
}
