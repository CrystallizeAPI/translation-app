import type { ClientInterface } from "@crystallize/js-api-client";

export const getAvailableLanguages =
  (apiClient: ClientInterface) => async () => {
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
        `,
      {
        identifier: process.env.CRYSTALLIZE_TENANT_IDENTIFIER,
      }
    );

    return data.tenant.get.availableLanguages;
  };
