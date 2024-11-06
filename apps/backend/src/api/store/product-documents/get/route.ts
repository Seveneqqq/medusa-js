import { Pool } from "pg";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const corsOptions = {
    origin: process.env.STORE_CORS,
    credentials: true,
};

export const GET = async (req: any, res: any) => {
    cors(corsOptions)(req, res, async () => {
        try {
            const productId = req.query.product_id; 

            const sql = `
                SELECT f.file_id, f.file_name, f.language, f.document_type, f.created_at
                FROM product_file pf
                JOIN file f ON pf.file_id = f.file_id
                WHERE pf.product_id = $1
            `;
            const result = await pool.query(sql, [productId]);

            res.status(200).json(result.rows); 
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

export const OPTIONS = cors(corsOptions);

export const CORS = false;
