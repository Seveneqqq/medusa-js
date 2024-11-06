// src/modules/b2b-accounts/models/b2b-account.ts
import { model } from "@medusajs/framework/utils"

const b2bAccount = model.define("b2b_account", {  
  id: model.id().primaryKey(),
  name: model.text(),
  approved: model.boolean().default(false),
})

export default b2bAccount;