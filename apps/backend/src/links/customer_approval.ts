import customerApprovedModule from "../modules/customer-approved"
import CustomerModule from "@medusajs/medusa/customer"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
    customerApprovedModule.linkable.customerApproved,
    CustomerModule.linkable.customer
)