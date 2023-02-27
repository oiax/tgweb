import * as PATH from "path"

const slash = path => path.split(PATH.sep).join(PATH.posix.sep)

export { slash }
