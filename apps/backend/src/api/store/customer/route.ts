
import dotenv from 'dotenv';
import cors from 'cors';

import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { RemoteQueryFunction } from "@medusajs/framework/types";

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
        
        try{
        const query = req.scope.resolve<RemoteQueryFunction>(
            ContainerRegistrationKeys.QUERY
         );
      
         const email  = req.query.email;

         const { data: [customer_approved] } = await query.graph(
            {
              entity: "customer",
              fields: ["customer_approved.approved"],
              filters: {
                email,
              },
            },
            { throwIfKeyNotFound: true }
          );
 
         res.status(200).json({
            customer_approved
         });
        }catch(error){
            res.status(500).json({ message: error.message });
        }

    });
};

export const OPTIONS = cors(corsOptions);

export const CORS = false;