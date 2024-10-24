import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { Pool } from "pg";
import dotenv from "dotenv"; 

// Initialize PostgreSQL client
const pool = new Pool({
    user: 'postgres',        
    host: 'localhost',            
    database: 'medusa-backend',     
    password: 'admin',
    port: 5432,          
});

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    
    const query = `
                        INSERT INTO public.document (
                        file_name, language, document_type, product_id, created_at, updated_at, deleted_at
                        ) 
                        VALUES ('111', 'pl', '12', 'prod_01JAW9P8STC045RWRASHP6JD5J', NOW(), NOW(), NULL);
                        `;

    res.send(await pool.query(query)); 
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {

    const uploadDir = path.join(__dirname, '../../../uploads'); // Ensure this is the correct directory

    // Create the upload directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
        uploadDir: uploadDir, // Directory where the files will be uploaded
        keepExtensions: true, // Keep file extensions
        filename: (name, ext, part) => part.originalFilename || `file-${Date.now()}${ext}`, // Define how to name the files
    });

    const query = `
                        INSERT INTO public.document (
                        file_name, language, document_type, product_id, created_at, updated_at, deleted_at
                        ) 
                        VALUES ('111', 'pl', '12', 'prod_01JAW9P8STC045RWRASHP6JD5J', NOW(), NOW(), NULL);
                `;
    await pool.query(query);
    

    form.parse(req, async (err, fields, files) => { 
        res.status(200).json({ message: req.body });
    });

    
    res.status(200).json({ message: req.body });
};

