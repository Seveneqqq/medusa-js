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
import {createApprovalWorkflow} from "../../../../../workflows/customer"
import {addToApprovalValidator} from "../../validators"

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
            const validationResult = addToApprovalValidator.safeParse(req.body);
            console.log(validationResult)
            if (!validationResult.success) {
                return res.status(400).json({
                    error: validationResult.error.errors
                });
            }

            const { email } = validationResult.data;
            console.log('emmmmmmm ' +email);

            const { result } = await createApprovalWorkflow(req.scope).run({
              //@ts-ignore
                input: validationResult.data,
            });

            const remoteLink: RemoteLink = req.scope.resolve(
              ContainerRegistrationKeys.REMOTE_LINK
            )

            await remoteLink.create({
              "customerApprovedModuleService": {
                customer_approved_id: result.id,
              },
              [Modules.CUSTOMER]: {
                customer_id: validationResult.data.customer_id,
              },
            })

            console.log('customer_id', validationResult.data.customer_id);
            console.log('result.id', result.id);
            console.log('result',result);

            res.status(200).send({ 
                email: validationResult.data.email, 
                result 
            });

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