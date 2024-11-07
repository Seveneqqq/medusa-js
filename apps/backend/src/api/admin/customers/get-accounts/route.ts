import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { AdminCreateAccountsType } from "./validators";
import { accountsQueryConfig } from "./query-config";

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {

  try{

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const fields = req.remoteQueryConfig?.fields || accountsQueryConfig.list.defaults;

const { data: customers, metadata } = await query.graph({
  entity: "customer",
  fields: ['*'],
  filters: req.filterableFields,
});

  res.json({
    customers,
  });

  }catch(err){
    res.status(200).json({ error: err.message });
  }

};


