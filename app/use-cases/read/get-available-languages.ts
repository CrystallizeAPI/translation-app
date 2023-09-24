import { apiClient } from "../shared";

export async function getAvailableLanguages() {
    const data = await apiClient.pimApi(
        `#graphql
            query ($identifier: String!) {
                tenant {
                    get(identifier: $identifier) {
                        availableLanguages {
                            name
                            code
                        }
                    }
                }
            }
        `, {
            identifier: process.env.CRYSTALLIZE_TENANT_IDENTIFIER
        }
    )
  return data.tenant.get.availableLanguages;
}
