import { ClientInterface } from "@crystallize/js-api-client";
import { getAvailableLanguages } from "./read/get-available-languages";
import { getItemComponents } from "./read/get-item-components";
import { getVariantComponents } from "./read/get-variant-components";
import { updateItemComponent } from "./write/update-item-component";
import { updateVariantComponent } from "./write/update-variant-component";
import { updateItemName } from "./write/update-item-name";

export const getApi = (apiClient: ClientInterface) => {
    return {
        getAvailableLanguages: async () =>
            getAvailableLanguages(apiClient)(apiClient.config.tenantIdentifier),
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
