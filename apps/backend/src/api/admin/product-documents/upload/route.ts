import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, 
});


export const POST = async (req: any, res: any) => {
    try {
    
        const { product_id, documents } = req.body;

        console.log(product_id, documents);

        for (const doc of documents) {

            const checkFileQuery = `
                SELECT file_id FROM attachment 
                WHERE file_name = $1 AND language = $2 AND document_type = $3
            `;
            const checkFileResult = await pool.query(checkFileQuery, [doc.file_name, doc.language, doc.document_type]);

            let file_id;

            if (checkFileResult.rows.length > 0) {
                file_id = checkFileResult.rows[0].file_id;
            } else {
                const insertFileQuery = `
                    INSERT INTO attachment (file_name, language, document_type, created_at) 
                    VALUES ($1, $2, $3, NOW())
                    RETURNING file_id
                `;
                const insertFileResult = await pool.query(insertFileQuery, [doc.file_name, doc.language, doc.document_type]);
                file_id = insertFileResult.rows[0].file_id;
            }

            const insertProductFileQuery = `
                INSERT INTO product_attachment (product_id, file_id)
                VALUES ($1, $2)
            `;
            await pool.query(insertProductFileQuery, [product_id, file_id]);
        }

        res.status(200).json({
            message: 'Documents processed successfully.',
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            message: 'An error occurred while processing the request.',
            error: error.message, 
        });
    }
};
