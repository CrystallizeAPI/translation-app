import { apiClient } from "../shared";

export async function updateParagraphCollection(itemId: string, language: string, componentId: string, content: string) {
    const data = await apiClient.pimApi(
        `#graphql
            mutation($itemId: ID!, $language: String!, $componentId: String!) {
                item {
                updateComponent(
                    itemId: $itemId
                    language: $language
                    input: {
                    componentId: $componentId
                    paragraphCollection: {
                        paragraphs: { title: { text: "" }, body: { html: "" } }
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
    }
    )
    return data.item.updateComponent;
}