import { MedusaRequest } from "@medusajs/framework";
import { 
    AdminListCustomersParamsType,
    AdminCustomerSearchParamsType
} from "./validators";

export const listCustomersConfig = {
    deserialize(req: MedusaRequest<AdminListCustomersParamsType>) {
        const { validatedQuery } = req;
        const { page = 0, limit = 20 } : any = validatedQuery;

        return {
            skip: page * limit,
            take: limit,
            include_customer_approved: true,
        };
    },
    serialize(data) {
        if (!data) {
            return;
        }

        const { customers_approved, count } = data;

        return {
            customers_approved,
            meta: {
                page: Math.floor(data.skip / data.take),
                limit: data.take,
                total: count,
                pageCount: Math.ceil(count / data.take)
            }
        };
    },
};

export const transformQueryConfig = {
    defaultFields: [
        "id",
        "email",
        "approved",
        "created_at",
        "updated_at",
    ],
    defaultRelations: [],
    allowedFields: [
        "id",
        "email",
        "approved",
        "created_at",
        "updated_at",
    ],
    allowedRelations: [],
    defaultLimit: 20,
    isList: true,
};

export const retrieveTransformQueryConfig = {
    ...transformQueryConfig,
    isList: false,
};

export const searchQueryConfig = {
    deserialize(req: MedusaRequest<AdminCustomerSearchParamsType>) {
        const { validatedQuery } = req;
        return {
            ...validatedQuery,
            include_customer_approved: true,
        };
    },
};