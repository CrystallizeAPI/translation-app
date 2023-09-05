import { createClient } from "@crystallize/js-api-client";

export const apiClient = createClient({
  tenantIdentifier: process.env.CRYSTALLIZE_TENANT_IDENTIFIER ?? "frntr",
  accessTokenId: process.env.CRYSTALLIZE_ACCESS_TOKEN_ID,
  accessTokenSecret: process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET,
  tenantId: process.env.CRYSTALLIZE_TENANT_ID,
});
