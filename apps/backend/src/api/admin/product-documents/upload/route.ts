import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework";
import { bodySchema } from './validators'
import DocumentModuleService from "src/modules/documents/service";

export const POST = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    try {
        const { product_id, documents } : any = req.body;

        const documentModuleService = req.scope.resolve<DocumentModuleService>(
            "documentModuleService"
        );

        const results = await Promise.all(
            documents.map(async (doc) => {
                try {

                    const existingFiles = await documentModuleService.listAttachments({
                        file_name: doc.file_name,
                        language: doc.language,
                        document_type: doc.document_type
                    });

                    let file_id;

                    if (existingFiles && existingFiles.length > 0) {
                        file_id = existingFiles[0].file_id;
                    } else {

                        const newAttachment = await documentModuleService.createAttachments({
                            file_name: doc.file_name,
                            language: doc.language,
                            document_type: doc.document_type,
                            created_at: new Date()
                        });
                        file_id = newAttachment.file_id;
                    }

                    const existingProductAttachment = await documentModuleService.listProduct_attachments({
                        product_id: product_id,
                        file_id: file_id
                    });

                    if (existingProductAttachment && existingProductAttachment.length > 0) {
                        return {
                            success: true,
                            file_id: file_id,
                            file_name: doc.file_name,
                            skipped: true,
                            message: 'Document already attached to product'
                        };
                    }

                    await documentModuleService.createProduct_attachments({
                        product_id: product_id,
                        file_id: file_id
                    });

                    return {
                        success: true,
                        file_id: file_id,
                        file_name: doc.file_name,
                        skipped: false,
                        message: 'Document attached successfully'
                    };
                } catch (error) {
                    console.error(`Error processing document ${doc.file_name}:`, error);
                    return {
                        success: false,
                        file_name: doc.file_name,
                        error: error.message,
                        skipped: false
                    };
                }
            })
        );

        const processed = results.filter(r => r.success && !r.skipped).length;
        const skipped = results.filter(r => r.skipped).length;
        const failed = results.filter(r => !r.success).length;

        const hasErrors = results.some(result => !result.success);

        if (hasErrors) {
            const failedDocs = results
                .filter(result => !result.success)
                .map(result => result.file_name);

            res.status(207).json({
                message: 'Some documents failed to process',
                summary: {
                    processed,
                    skipped,
                    failed
                },
                results: results,
                failedDocuments: failedDocs
            });
        } else {
            res.status(200).json({
                message: 'All documents processed successfully',
                summary: {
                    processed,
                    skipped,
                    failed
                },
                results: results
            });
        }

    } catch (error) {
        console.error('Error in document processing:', error);
        res.status(500).json({
            message: 'An error occurred while processing the documents',
            error: error.message
        });
    }
};