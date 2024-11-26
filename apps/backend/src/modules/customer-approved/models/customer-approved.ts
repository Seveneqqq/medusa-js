import { model } from "@medusajs/framework/utils"

const CustomerApproved = model.define("customer_approved", {
  id: model.id().primaryKey(),
  email: model.text().unique(),
  approved: model.boolean().default(false),
})

export default CustomerApproved