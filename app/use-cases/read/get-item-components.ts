import type { Item, Maybe } from "~/__generated__/types";
import { Component } from "./fragments";
import type { ClientInterface } from "@crystallize/js-api-client";

export const getItemComponents =
  (apiClient: ClientInterface) => async (id: string, language: string) => {
    const data = await apiClient.pimApi(
      `#graphql
     query GET_PRODUCT_COMPONENTS($id: ID!, $language: String!, $versionLabel: VersionLabel) {
      item {
       get(id: $id, language: $language, versionLabel: $versionLabel) {
        id
        name
        language
        type
        components {
          ...Component
        }
      }
    }
  }
  ${Component}
    `,
      {
        id: id ?? "651fb51410fc8c0b9516655a",
        version: "draft",
        language: language || "en",
      }
    );

    return data?.item?.get as Maybe<Item>;
  };
