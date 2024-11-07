// src/modules/b2b-accounts/index.ts
import B2BAccountService from "./service"
import { Module } from "@medusajs/framework/utils"

export const B2B_ACCOUNT_MODULE = "b2bAccountService"

export default Module(B2B_ACCOUNT_MODULE, {
  service: B2BAccountService,

})