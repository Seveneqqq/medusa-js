import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(__dirname, '../../../../../../uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {

        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
        const originalName = file.originalname;
        const ext = path.extname(originalName);
        const baseName = path.basename(originalName, ext);

        const uniqueSuffix = `${baseName}`;
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    upload.array('files')(req, res, (err) => {
        if (err) {
            console.error("Error uploading the files:", err);
            return res.status(500).json({ error: "File upload failed", details: err.message });
        }

        console.log('Files received:', req.files);
        return res.status(200).json({ files: req.files });
    });
};
