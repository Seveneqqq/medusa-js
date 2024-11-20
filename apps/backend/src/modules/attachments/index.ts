import AttachmentsModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const ATTACHMENTS_MODULE = "attachmentsModuleService"

export default Module(ATTACHMENTS_MODULE, {
  service: AttachmentsModuleService,
})