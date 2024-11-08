import dotenv from 'dotenv'
import cors from 'cors'
import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework"

import CustomerApprovedModuleService from "src/modules/customer-approved/service"

dotenv.config()

const corsOptions = {
    origin: process.env.STORE_CORS,
    credentials: true,
}



export const POST = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    cors(corsOptions)(req, res, async () => {
        try {

            const {email} = req.body;

            res.status(200).send({ email:email});
            
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    })
}

export const OPTIONS = cors(corsOptions)

export const CORS = false