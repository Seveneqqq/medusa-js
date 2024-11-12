import CustomerApprovedModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const CUSTOMER_APPROVED_MODULE = "customerApprovedModuleService"

export default Module(CUSTOMER_APPROVED_MODULE, {
  service: CustomerApprovedModuleService,
})