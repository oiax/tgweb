import pretty from "pretty"

const dbg = arg => console.log(arg)

const pp = element => {
  console.log("<<<<")
  console.log(pretty(element.outerHTML, {ocd: true}))
  console.log(">>>>")
}

export { dbg, pp }
