import dotenv from 'dotenv'
import cors from 'cors'
import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework"

import {createApprovalWorkflow} from "../../../../workflows/customer"

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
            const { result } = await createApprovalWorkflow(req.scope).run({
                input: req.body,
             });
            
            res.status(200).send({ email:email, result: result });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error,
            })
        }
    })
}

export const OPTIONS = cors(corsOptions)

export const CORS = false