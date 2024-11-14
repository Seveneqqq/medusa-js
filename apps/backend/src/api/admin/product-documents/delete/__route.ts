import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, 
});

export const DELETE = async (req: any, res: any) => {
    try {
        const id = req.body.id; 
        const file_name = req.body.file_name;

        const deleteProductFilesSql = `
            DELETE FROM product_file 
            WHERE file_id = (SELECT file_id FROM file WHERE file_name = $1 LIMIT 1) and product_id = $2
        `;
        const result = await pool.query(deleteProductFilesSql, [file_name,id]);

        // Następnie usuwamy rekord z tabeli file
        // const deleteFileSql = `
        //     DELETE FROM file 
        //     WHERE file_name = $1 AND file_id = (SELECT file_id FROM file WHERE file_name = $1 LIMIT 1)
        // `;
        // const result = await pool.query(deleteFileSql, [file_name]);

        res.status(200).json({ message: 'Document deleted successfully',id: id, affectedRows: result.rowCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
