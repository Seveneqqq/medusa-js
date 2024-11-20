import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { RemoteQueryFunction } from "@medusajs/framework/types";
import AttachmentsModuleService from "src/modules/attachments/service";
import cors from 'cors';

const corsOptions = {
    origin: process.env.STORE_CORS,
    credentials: false,
};

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    cors(corsOptions)(req, res, async () => {
    
        try {
            const query = req.scope.resolve<RemoteQueryFunction>(
                ContainerRegistrationKeys.QUERY
            );
    
            const product_id = req.query.product_id;
            const attachmentsModuleService = req.scope.resolve<AttachmentsModuleService>(
                "AttachmentsModuleService"
            );
    
            const [product_attachments] = await attachmentsModuleService.listAndCountProduct_attachments(
                {
                    product_id: product_id,
                },
                {
                    select: ["*"],
                }
            );
    
            const attachmentsArrays = await Promise.all(
                product_attachments.map(async (doc: any) => {
                    const attachment = await attachmentsModuleService.listAttachments(
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

    });
};

export const OPTIONS = cors(corsOptions);

export const CORS = true;
