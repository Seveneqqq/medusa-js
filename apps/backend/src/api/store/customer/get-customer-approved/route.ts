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
            
            const email = req.query.email;

            if (!email) {
                return res.status(400).json({ 
                    error: "Email is required" 
                });
            }

            const query = {
                text: 'SELECT approved FROM customer WHERE email = $1',
                values: [email],
            };

            const result = await pool.query(query);

            if (result.rows.length === 0) {
                return res.status(404).json({ 
                    error: "Customer not found" 
                });
            }
            return res.status(200).json({
                approved: result.rows[0].approved
            });

        } catch (error) {
            console.error('Database error:', error);
            return res.status(500).json({ 
                error: "Internal server error" 
            });
        }
    });
};

export const OPTIONS = cors(corsOptions);

export const CORS = false;