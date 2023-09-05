import { apiClient } from "./shared";

export async function getTenantInformation() {
  const data = await apiClient.pimApi(
    `#graphql
        query ($identifier: string) {
            tenant {
            get(identifier:$identifier){
                id
                availableLanguages {
                    code
                    name
                 }
                }
             }
          }
        `,
    {
      identifier: process.env.CRYSTALLIZE_TENANT_IDENTIFIER,
    }
  );
  return { ...data };
}
