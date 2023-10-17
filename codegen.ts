import type { CodegenConfig } from "@graphql-codegen/cli";

const tokenId = process.env.CRYSTALLIZE_ACCESS_TOKEN_ID;
const tokenSecret = process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET;
const tenantIdentifier = process.env.CRYSTALLIZE_TENANT_IDENTIFIER;

if (!tokenId || !tokenSecret || !tenantIdentifier) {
  throw new Error("Missing env variable(s) when generating api legacy schemas");
}

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [`https://api.crystallize.com/${tenantIdentifier}/catalogue`]: {
        headers: {
          "X-Crystallize-Access-Token-Id": tokenId,
          "X-Crystallize-Access-Token-Secret": tokenSecret,
        },
      },
    },
  ],
  generates: {
    "./app/__generated__/types.ts": {
      schema: "./src/client-schema.graphql",
      plugins: ["typescript"],
      config: {
        preResolveTypes: false,
      },
    },
  },
};

export default config;
