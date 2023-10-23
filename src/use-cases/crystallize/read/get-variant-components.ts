import type { Maybe, Product } from "~/__generated__/types";
import { Component } from "./fragments";
import type { ClientInterface } from "@crystallize/js-api-client";

export const getVariantComponents =
    (apiClient: ClientInterface) =>
        async (id: string, language: string, sku: string) => {
            const data = await apiClient.pimApi(
                `#graphql
     query GET_VARIANT_COMPONENTS($id: ID!, $language: String!, $sku: String!, $versionLabel: VersionLabel) {
      product{
       get(id: $id, language: $language, versionLabel: $versionLabel) {
        id
        language
        name
        variant(sku: $sku) {
          id
          components {
            ...Component
          }
        }
      }
    }
  }
  ${Component}
    `,
                {
                    id,
                    sku,
                    language,
                    version: "draft",
                }
            );

            return data?.product?.get as Maybe<Product>;
        };
