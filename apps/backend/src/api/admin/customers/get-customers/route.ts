import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { RemoteQueryFunction } from "@medusajs/framework/types";
import CustomerApprovedModuleService from "src/modules/customer-approved/service";

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {

  try{

    const { page, limit } = req.query;

    const pageNum = parseInt(page as string) || 0;
    const limitNum = parseInt(limit as string) || 20;
    const skip = limitNum * pageNum;

    const query = req.scope.resolve<RemoteQueryFunction>(
      ContainerRegistrationKeys.QUERY
   );

   const { data: customers_approved, metadata } = await query.graph({
    entity: "customer_approved",
    fields: ['*'],
    pagination: {
      skip: skip,
      take: limitNum,
    },
  });

  res.json({
    customers_approved,
  });

  }catch(err){
    console.log(err);
    res.status(500).json({"error": err});
  }
  
};


