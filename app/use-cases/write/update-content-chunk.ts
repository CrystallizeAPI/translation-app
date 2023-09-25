import { apiClient } from "../shared";

export async function updateContentChunk(itemId: string, language: string, componentId: string, content: any) {
    
    const itemsToUpdate = [
        content?.type === "singleLine" && { singleLine: { text: content?.translation }, componentId: content.id },
        content?.type === "richText" && { richText: { html: content?.translation }, componentId: content.id },
    ].filter(Boolean);

    const data = await apiClient.pimApi(
        `#graphql
            mutation($itemId: ID!, $language: String!, $componentId: String!, $content: [[ComponentInput!]!]!) {
                item {
                updateComponent(
                    itemId: $itemId
                    language: $language
                    input: {
                    componentId: $componentId
                    contentChunk: {
                        chunks: $content
                    }
                    }
                ) {
                    id
                 }
                }
            }
            `, {
        itemId,
        language,
        componentId,
        content: itemsToUpdate
    }
    )
    return data.item.updateComponent;
}