import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const GET = async (req: any, res: any) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 25;
    const offset = page * limit;

    try {
        const countQuery = `
            SELECT COUNT(*) 
            FROM customer 
            WHERE approved = false
        `;
        const countResult = await pool.query(countQuery);
        const totalCount = parseInt(countResult.rows[0].count);

        const sql = `
            SELECT id, company_name, email, created_at, approved 
            FROM customer 
            WHERE approved = false 
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const result = await pool.query(sql, [limit, offset]);

        res.status(200).json({
            data: result.rows,
            meta: {
                page,
                limit,
                total: totalCount,
                pageCount: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};