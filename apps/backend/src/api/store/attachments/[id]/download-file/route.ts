import dotenv from 'dotenv';
import cors from 'cors';
import path from "path";
import fs from 'fs';

dotenv.config();

const corsOptions = {
    origin: process.env.STORE_CORS, 
    credentials: false,
    
};

export const POST = async (req: any, res: any) => {

    cors(corsOptions)(req, res, async () => {
        try {
            const id = req.body.product_id; 
            const file = req.body.file_name; 

            
            const uploadDir = path.join(__dirname, '../../../../../../uploads');
            const filePath = path.join(uploadDir, file);

            
            if (fs.existsSync(filePath)) {
                
                res.download(filePath, (err) => {
                    if (err) {
                        console.error("Error downloading file:", err);
                        res.status(500).send('Error downloading file');
                    }
                });
            } else {
                res.status(404).send('File not found');
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};


export const OPTIONS = cors(corsOptions);


export const CORS = true;
