import { model } from "@medusajs/framework/utils"

const CustomerApproved = model.define("customer_approved", {
  email: model.text().primaryKey(),
  approved: model.boolean().default(false),
})

export default CustomerApproved