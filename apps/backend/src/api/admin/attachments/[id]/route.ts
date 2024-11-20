import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework";
import AttachmentsModuleService from "src/modules/attachments/service";

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    try {
        
        const product_id = req.params.id;

        const AttachmentsModuleService = req.scope.resolve<AttachmentsModuleService>(
            "AttachmentsModuleService"
        );

        const [product_attachments] = await AttachmentsModuleService.listAndCountProduct_attachments(
            {
                product_id: product_id,
            },
            {
                select: ["*"],
            }
        );

        const attachmentsArrays = await Promise.all(
            product_attachments.map(async (doc: any) => {
                const attachment = await AttachmentsModuleService.listAttachments(
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
            attachments, product_attachments
        });
    } catch (error) {
        console.error("Error fetching attachments:", error);
        res.status(500).json({ 
            message: error instanceof Error ? error.message : "An unknown error occurred" 
        });
    }
};