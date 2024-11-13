import { model } from "@medusajs/framework/utils"

const product_attachment = model.define("product_attachment", {
  id: model.number().primaryKey(),
  product_id: model.text(),
  file_id: model.number(),
})

export default product_attachment