const { QUOTE_MODULE } = require("./src/modules/quote");
const { loadEnv, defineConfig, Modules } = require("@medusajs/framework/utils");

loadEnv(process.env.NODE_ENV, process.cwd());

module.exports = defineConfig({
  projectConfig: {
    fileService: {
      provider: "local",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local-next",
            id: "local",
            options: {
              upload_dir: "static", // Katalog, w którym będą przechowywane pliki
              backend_url: "http://localhost:9000/static" // Adres, pod którym pliki będą dostępne
            },
          },
        ],
      },
    },
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: {
    documentModuleService: {
      resolve: "./modules/documents",
    },
    customerApprovedModuleService: {
      resolve: "./src/modules/customer-approved",
    },
    b2bAccountService: {
      resolve: "./src/modules/b2b-accounts",
    },
    companyModuleService: {
      resolve: "./modules/company",
    },
    [QUOTE_MODULE]: {
      resolve: "./modules/quote",
    },
    [Modules.CACHE]: {
      resolve: "@medusajs/medusa/cache-inmemory",
    },
    [Modules.WORKFLOW_ENGINE]: {
      resolve: "@medusajs/medusa/workflow-engine-inmemory",
    },
  },
});
