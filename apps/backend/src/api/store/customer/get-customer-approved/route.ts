
import dotenv from 'dotenv';
import cors from 'cors';

import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { AdminCreateApprovedType } from "./validators";
import { approvedQueryConfig } from "./query-config";

dotenv.config();

const corsOptions = {
    origin: process.env.STORE_CORS,
    credentials: true,
};

export const GET = async (req: any, res: any) => {
    cors(corsOptions)(req, res, async () => {
        
        const email = req.query.email;    
        
        res.status(200).json(email);

    });
};

export const OPTIONS = cors(corsOptions);

export const CORS = false;