import { apiClient } from "../shared";
import type { Item, Maybe } from "~/__generated__/types";
import { Component } from "./fragments";

export async function getItemFromPath(id: string, language: string) {
  const data = await apiClient.pimApi(
    `#graphql
     query GET_PRODUCT_COMPONENTS($id: ID!, $language: String!, $versionLabel: VersionLabel) {
      item {
       get(id: $id, language: $language, versionLabel: $versionLabel) {
        id
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
      id: id || "64dcc8084ae8428a30beb442",
      version: "draft",
      language: language || "en",
    }
  );

  return data?.item?.get as Maybe<Item>;
}
