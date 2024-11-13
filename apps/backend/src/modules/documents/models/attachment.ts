import { model } from "@medusajs/framework/utils"

const attachment = model.define("attachment", {
  id: model.number().primaryKey(),
  file_id: model.number(),
  file_name: model.text(),
  language: model.text(),
  document_type: model.text(),
})

export default attachment