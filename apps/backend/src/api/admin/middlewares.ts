import { MiddlewareRoute } from "@medusajs/medusa";
import { adminCompaniesMiddlewares } from "./companies/middlewares";
import { adminQuotesMiddlewares } from "./quotes/middlewares";
import { adminCustomersMiddlewares } from "./customer/middlewares";
import { adminAttachmentsMiddlewares } from "./attachments/middlewares"; 


export const adminMiddlewares: MiddlewareRoute[] = [
  ...adminCompaniesMiddlewares,
  ...adminQuotesMiddlewares,
  ...adminCustomersMiddlewares,
  ...adminAttachmentsMiddlewares, 
];
