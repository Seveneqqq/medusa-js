import { MedusaService } from "@medusajs/framework/utils"
import attachment from "./models/attachment"
import product_attachment from "./models/product_attachment"

class AttachmentsModuleService extends MedusaService({
  product_attachment,
  attachment,
}){
}

export default AttachmentsModuleService