import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { AdminCreateDocumentType } from "./validators";
import { documentQueryConfig } from "./query-config";
import { DOCUMENT_MODULE } from 'src/modules/documents';
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

        const product_id = req.query.product_id;
        const documentModuleService = req.scope.resolve<DocumentModuleService>(
            "documentModuleService"
        );

        const [product_attachments] = await documentModuleService.listAndCountProduct_attachments(
            {
                product_id: product_id,
            },
            {
                select: ["*"],
            }
        );

        const attachmentsArrays = await Promise.all(
            product_attachments.map(async (doc: any) => {
                const attachment = await documentModuleService.listAttachments(
                    {
                        file_id: doc.file_id,
                    },
                    {
                        select: ["*"],
                    }
                );
                return attachment[0] || [];
            })
        );

        const attachments = attachmentsArrays.flat().filter(attachment => Object.keys(attachment).length > 0);

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