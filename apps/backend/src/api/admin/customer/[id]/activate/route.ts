import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { RemoteQueryFunction } from "@medusajs/framework/types";
import CustomerApprovedModuleService from "src/modules/customer-approved/service";

export const POST = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
    ) => {
    
    try {

        const { emails } : any = req.body;

        const query = req.scope.resolve<RemoteQueryFunction>(
            ContainerRegistrationKeys.QUERY
         );
    
         const customerApprovedModuleService =
         req.scope.resolve<CustomerApprovedModuleService>(
            "customerApprovedModuleService"
         );

         emails.forEach(async (email) => {
            const customer = await customerApprovedModuleService.updateCustomerApproveds({
                email,
                approved: true
            });
         });

        res.status(200).json({ message: 'Success' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ Error:error});
    }

    

};