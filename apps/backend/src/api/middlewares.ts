import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { defineMiddlewares, authenticate } from "@medusajs/medusa";
import { adminMiddlewares } from "./admin/middlewares";
import { storeMiddlewares } from "./store/middlewares";

export default defineMiddlewares({
  routes: [
    ...adminMiddlewares,
    ...storeMiddlewares,
    {
      matcher: "/admin/attachments/get-all",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    {
      matcher: "/admin/attachments",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    {
      matcher: "/admin/attachments/[id]",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    {
      matcher: "/admin/attachments/[id]/delete",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    {
      matcher: "/admin/attachments/[id]/upload",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    {
      matcher: "/admin/attachments/[id]/save-file",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    {
      matcher: "/admin/customers/activate",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    {
      matcher: "/admin/customers/get-customers",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    {
      matcher: "/admin/attachments/get",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    {
      matcher: "/admin/attachments/upload",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    // {
    //   matcher: "/store/customer/add-to-approval",
    //   middlewares: [
    //     authenticate("user", ["session", "bearer", "api-key"])
    //   ],
    // },
    {
      matcher: "/admin/attachments/save-file",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    {
      matcher: "/admin/attachments/delete",
      middlewares: [
        authenticate("user", ["session", "bearer", "api-key"])
      ],
    },
    {
      matcher: "/store/customers/me",
      middlewares: [
        (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
          req.allowed = [
            "orders",
            "addresses",
            "employee",
            "employees",
          ];
          next();
        },
      ],
    },
  ],
});