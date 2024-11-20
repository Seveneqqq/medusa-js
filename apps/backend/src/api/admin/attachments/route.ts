import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { RemoteQueryFunction } from "@medusajs/framework/types";
import AttachmentsModuleService from "src/modules/attachments/service";


export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    try {
        
        const query = req.scope.resolve<RemoteQueryFunction>(
            ContainerRegistrationKeys.QUERY
        );

        const AttachmentsModuleService = req.scope.resolve<AttachmentsModuleService>(
            "AttachmentsModuleService"
        );

        const attachments = await AttachmentsModuleService.listAttachments();

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

const generateFileId = (fileName: string): number => {
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9]/g, '');
    const nameHash = cleanFileName
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const combinedId = `${timestamp}${nameHash}`;
    return parseInt(combinedId.slice(-9));
};

export const POST = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    try {
        const { product_id, attachments } : any = req.body;

        console.log("Processing attachments:", product_id, attachments);

        const AttachmentsModuleService = req.scope.resolve<AttachmentsModuleService>(
            "AttachmentsModuleService"
        );

        const results = await Promise.all(
            attachments.map(async (doc) => {
                try {
                    
                    const generatedFileId = generateFileId(doc.file_name);

                    const newAttachment = await AttachmentsModuleService.createAttachments({
                        file_id: generatedFileId,
                        file_name: doc.file_name,
                        language: doc.language,
                        document_type: doc.document_type,
                        created_at: new Date()
                    });

                    await AttachmentsModuleService.createProduct_attachments({
                        product_id: product_id,
                        file_id: newAttachment.file_id
                    });

                    return {
                        success: true,
                        file_id: newAttachment.file_id,
                        file_name: doc.file_name,
                        skipped: false,
                        message: 'Attachment created and linked successfully'
                    };
                } catch (error) {
                    console.error(`Error processing attachment ${doc.file_name}:`, error);
                    return {
                        success: false,
                        file_name: doc.file_name,
                        error: error instanceof Error ? error.message : String(error),
                        skipped: false
                    };
                }
            })
        );

        const processed = results.filter(r => r.success && !r.skipped).length;
        const failed = results.filter(r => !r.success).length;

        const hasErrors = results.some(result => !result.success);

        if (hasErrors) {
            const failedDocs = results
                .filter(result => !result.success)
                .map(result => result.file_name);

            return res.status(207).json({
                message: 'Some attachments failed to process',
                summary: {
                    processed,
                    failed
                },
                results: results,
                failedAttachments: failedDocs
            });
        }

        return res.status(200).json({
            message: 'All attachments processed successfully',
            summary: {
                processed,
                failed
            },
            results: results
        });

    } catch (error) {
        console.error('Error in attachment processing:', error);
        return res.status(500).json({
            message: 'An error occurred while processing the attachments',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const DELETE = async(
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) =>{

    try {
        
        const { id } = req.body;

        console.log("Deleting attachments for product:", id);

        const AttachmentsModuleService = req.scope.resolve<AttachmentsModuleService>(
            "AttachmentsModuleService"
        );

        const attachments = await AttachmentsModuleService.deleteProduct_attachments(id);

        res.status(200).json({Succes:attachments});


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while processing the request.",
            error: error
        });
    }

}