import { model } from "@medusajs/framework/utils"

const product_attachment = model.define("product_attachment", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  file_id: model.text(),
})

export default product_attachment