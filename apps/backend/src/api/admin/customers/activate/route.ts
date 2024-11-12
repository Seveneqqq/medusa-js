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

        const emails: string[] = req.body.emails;

        const query = req.scope.resolve<RemoteQueryFunction>(
            ContainerRegistrationKeys.QUERY
         );
    

        res.status(200).json({ message: 'Success' });

    } catch (error) {
        
    }

    

};