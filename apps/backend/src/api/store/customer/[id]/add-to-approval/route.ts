import dotenv from 'dotenv'
import cors from 'cors'
import type {
    AuthenticatedMedusaRequest,
    MedusaResponse,
} from "@medusajs/framework"
import { 
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils"
import { 
  RemoteLink,
} from "@medusajs/framework/modules-sdk"
import { Modules } from "@medusajs/framework/utils"
import { CUSTOMER_APPROVED_MODULE } from "../../../../../modules/customer-approved"
import {createApprovalWorkflow} from "../../../../../workflows/customer"


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

            const {email,customer_id} = req.body;
            
            if (!email) {
                return res.status(400).json({
                  error: "Email is required"
                });
              }
             
              if (typeof email !== 'string') {
                return res.status(400).json({
                  error: "Email must be a string"
                });
              }
             
              const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
              if (!emailRegex.test(email)) {
                return res.status(400).json({
                  error: "Invalid email format"
                });
              }
             

            const { result } = await createApprovalWorkflow(req.scope).run({
                input: req.body,
             });

             const remoteLink: RemoteLink = req.scope.resolve(
              ContainerRegistrationKeys.REMOTE_LINK
            )
             
            await remoteLink.create({
              "customerApprovedModuleService": {
                customer_approved_id: result.id,
              },
              [Modules.CUSTOMER]: {
                customer_id: customer_id,
              },
            })
            
            console.log('customer_id', customer_id);
            console.log('result.id', result.id);
            console.log('result',result);

            res.status(200).send({ email:email, result: result });
            
        } catch (error) {

          console.log(error);

            res.status(500).json({
                success: false,
                message: error,
            })
        }
    })
}

export const OPTIONS = cors(corsOptions)

export const CORS = true