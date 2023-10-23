import { createClient } from "@crystallize/js-api-client";
import { requireValidSession } from "~/server/session";
import {
  getAvailableLanguages,
  getItemComponents,
  getVariantComponents,
} from "./read";
import {
  updateItemComponent,
  updateVariantComponent,
  updateItemName,
} from "./write";

export const getApi = async (request: Request) => {
  const signatureChecked = await requireValidSession(request);

  const apiClient = createClient({
    tenantId: signatureChecked.tenantId,
    tenantIdentifier: signatureChecked.tenantIdentifier,
    accessTokenId: process.env.CRYSTALLIZE_ACCESS_TOKEN_ID,
    accessTokenSecret: process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET,
    origin: "-dev.crystallize.digital",
  });

  return {
    getAvailableLanguages: async () =>
      getAvailableLanguages(apiClient)(signatureChecked.tenantIdentifier),
    getItemComponents: async (
      ...params: Parameters<ReturnType<typeof getItemComponents>>
    ) => getItemComponents(apiClient)(...params),
    getVariantComponents: async (
      ...params: Parameters<ReturnType<typeof getVariantComponents>>
    ) => getVariantComponents(apiClient)(...params),
    updateItemComponent: async (
      ...params: Parameters<ReturnType<typeof updateItemComponent>>
    ) => updateItemComponent(apiClient)(...params),
    updateVariantComponent: async (
      ...params: Parameters<ReturnType<typeof updateVariantComponent>>
    ) => updateVariantComponent(apiClient)(...params),
    updateItemName: async (
      ...params: Parameters<ReturnType<typeof updateItemName>>
    ) => updateItemName(apiClient)(...params),
  };
};
