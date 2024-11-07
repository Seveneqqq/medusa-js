
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

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    cors(corsOptions)(req, res, async () => {
        
        try {
            

            const user_id = req.query.user_id; 
            
            const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
            
            const { data: approved, metadata } = await query.graph({
                entity: "customer_approved",
                fields: ['*'],
                
              });
        
            res.status(200).json(approved);

        } catch (error) {
            console.log('1213  ' +error)
            res.json({error:error.message});
        }
    });
};

export const OPTIONS = cors(corsOptions);

export const CORS = false;