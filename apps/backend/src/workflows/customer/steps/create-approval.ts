import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { CUSTOMER_APPROVED_MODULE } from "../../../modules/customer-approved";
//import CustomerApprovedModuleService from "../../../modules/customer-approved/service";

export const createApprovalStep = createStep(
   "create-approved-step",
   async (input: any, { container }) => {
      console.log("Tutaj sie wywala 1");

      const ApprovedModuleService: any = container.resolve(
         CUSTOMER_APPROVED_MODULE
      );

      const approved = await ApprovedModuleService.createCustomerApproveds(input);

      return new StepResponse(approved, approved.id);
   },

   async (id: string, { container }) => {
      const ApprovedModuleService: any = container.resolve(
         CUSTOMER_APPROVED_MODULE
      );

      await ApprovedModuleService.deleteCustomerApproveds(id);
   }
);