import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { RemoteQueryFunction } from "@medusajs/framework/types";
import DocumentModuleService from "src/modules/documents/service";


export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    try {
        
        const query = req.scope.resolve<RemoteQueryFunction>(
            ContainerRegistrationKeys.QUERY
        );

        const documentModuleService = req.scope.resolve<DocumentModuleService>(
            "documentModuleService"
        );

        const attachments = await documentModuleService.listAttachments({
            select: ['*'],
        });

        res.status(200).json({
            attachments
        });
    } catch (error) {
        console.error("Error fetching attachments:", error);
        res.status(500).json({ 
            message: error instanceof Error ? error.message : "An unknown error occurred" 
        });
    }
};