import { model } from "@medusajs/framework/utils"

const CustomerApproved = model.define("customer_approved", {
  id: model.id().primaryKey(),
  user_id: model.text(),
  approved: model.boolean().default(false),
})

export default CustomerApproved