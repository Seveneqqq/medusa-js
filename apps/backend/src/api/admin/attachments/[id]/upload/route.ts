import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework";
import DocumentModuleService from "src/modules/documents/service";

// Funkcja pomocnicza do generowania file_id
const generateFileId = (fileName: string): number => {
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9]/g, ''); // usuń znaki specjalne
    const nameHash = cleanFileName
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Łączymy timestamp z hash'em nazwy pliku i bierzemy ostatnie 9 cyfr
    // aby zmieścić się w zakresie integer w bazie danych
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

        const documentModuleService = req.scope.resolve<DocumentModuleService>(
            "documentModuleService"
        );

        const results = await Promise.all(
            attachments.map(async (doc) => {
                try {
                    // Generowanie unikatowego file_id
                    const generatedFileId = generateFileId(doc.file_name);

                    // Tworzenie nowego attachment z wygenerowanym file_id
                    const newAttachment = await documentModuleService.createAttachments({
                        file_id: generatedFileId,
                        file_name: doc.file_name,
                        language: doc.language,
                        document_type: doc.document_type,
                        created_at: new Date()
                    });

                    // Tworzenie powiązania z produktem
                    await documentModuleService.createProduct_attachments({
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
                    console.error(`Error processing document ${doc.file_name}:`, error);
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
        console.error('Error in document processing:', error);
        return res.status(500).json({
            message: 'An error occurred while processing the attachments',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};