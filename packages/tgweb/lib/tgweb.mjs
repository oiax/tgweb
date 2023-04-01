import { getSiteData } from "./tgweb/get_site_data.mjs"
import { create } from "./tgweb/create.mjs"
import { createInitially } from "./tgweb/create_initially.mjs"
import { update } from "./tgweb/update.mjs"
import { destroy } from "./tgweb/destroy.mjs"
import { updateDependencies } from "./tgweb/update_dependencies.mjs"

export default { getSiteData, create, createInitially, update, destroy, updateDependencies }
