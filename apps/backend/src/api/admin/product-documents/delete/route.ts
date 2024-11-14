import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { RemoteQueryFunction } from "@medusajs/framework/types";
import DocumentModuleService from "src/modules/documents/service";

export const POST = async(
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) =>{

    try {
        
        const { id } = req.body;

        const documentModuleService = req.scope.resolve<DocumentModuleService>(
            "documentModuleService"
        );

        const attachments = await documentModuleService.deleteProduct_attachments(
            {
                id,
            }
        );

        console.log(attachments);


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while processing the request.",
            error: error
        });
    }

}