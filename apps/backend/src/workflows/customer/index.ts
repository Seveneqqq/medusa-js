import {
    createWorkflow,
    WorkflowResponse,
 } from "@medusajs/framework/workflows-sdk";
 import { createApprovalStep } from "./steps/create-approval";
 
 
 export const createApprovalWorkflow = createWorkflow(
    "create-approval",
    (input: string) => {
        
        const approval = createApprovalStep(input);
       
        return new WorkflowResponse(approval);
    }
 );
 
 