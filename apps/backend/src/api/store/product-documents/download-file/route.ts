import { Pool } from "pg";
import dotenv from 'dotenv';
import cors from 'cors';
import path from "path";
import fs from 'fs';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Konfiguracja CORS
const corsOptions = {
    origin: process.env.STORE_CORS, // Upewnij się, że adres frontendowy jest poprawny
    credentials: true,
};

export const POST = async (req: any, res: any) => {
    // Zastosowanie CORS
    cors(corsOptions)(req, res, async () => {
        try {
            const id = req.body.product_id; // Id produktu
            const file = req.body.file_name; // Nazwa pliku

            // Ustawienie ścieżki do folderu z plikami
            const uploadDir = path.join(__dirname, '../../../../uploads');
            const filePath = path.join(uploadDir, file);

            // Sprawdzenie, czy plik istnieje
            if (fs.existsSync(filePath)) {
                // Użycie res.download do pobrania pliku
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

// Dodanie obsługi OPTIONS dla preflight requests
export const OPTIONS = cors(corsOptions);

// Wyłączenie domyślnej obsługi CORS Medusa
export const CORS = false;
