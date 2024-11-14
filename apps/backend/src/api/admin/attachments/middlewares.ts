import { MiddlewareRoute } from "@medusajs/medusa";
// import {
//     validateAndTransformBody,
//     validateAndTransformQuery,
//   } from "@medusajs/framework";
//   import {
//     listQuotesTransformQueryConfig,
//     retrieveQuoteTransformQueryConfig,
//   } from "./query-config";
//   import {
//     AdminCreateQuoteMessage,
//     AdminGetQuoteParams,
//     AdminRejectQuote,
//     AdminSendQuote,
//   } from "./validators";
  
  export const adminAttachmentsMiddlewares: MiddlewareRoute[] = [
    {
      method: ["GET"],
      matcher: "/admin/attachments",
      middlewares: [
        // validateAndTransformQuery(
        //   AdminGetQuoteParams,
        //   listQuotesTransformQueryConfig
        // ),
      ],
    },
    {
      method: ["GET"],
      matcher: "/admin/attachments/:id",
      middlewares: [
        // validateAndTransformQuery(
        //   AdminGetQuoteParams,
        //   retrieveQuoteTransformQueryConfig
        // ),
      ],
    },
    {
      method: ["POST"],
      matcher: "/admin/quotes/:id/upload",
      middlewares: [
        // validateAndTransformBody(AdminSendQuote),
        // validateAndTransformQuery(
        //   AdminGetQuoteParams,
        //   retrieveQuoteTransformQueryConfig
        // ),
      ],
    },
    {
      method: ["DELETE"],
      matcher: "/admin/quotes/:id/delete",
      middlewares: [
        // validateAndTransformBody(AdminRejectQuote),
        // validateAndTransformQuery(
        //   AdminGetQuoteParams,
        //   retrieveQuoteTransformQueryConfig
        // ),
      ],
    },
    {
      method: ["POST"],
      matcher: "/admin/quotes/:id/save-file",
      middlewares: [
        // validateAndTransformBody(AdminCreateQuoteMessage),
        // validateAndTransformQuery(
        //   AdminGetQuoteParams,
        //   retrieveQuoteTransformQueryConfig
        // ),
      ],
    },
  ];
  