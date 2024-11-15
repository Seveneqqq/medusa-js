import { model } from "@medusajs/framework/utils"

const attachment = model.define("attachment", {
  id: model.id().primaryKey(),
  file_id: model.text().nullable(),
  file_name: model.text(),
  language: model.text(),
  document_type: model.text(),
})

export default attachment