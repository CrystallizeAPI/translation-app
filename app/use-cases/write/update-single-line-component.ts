import { apiClient } from "../shared";

export async function updateSingleLineComponent(itemId: string, language: string, componentId: string, content: string) {
   const data = await apiClient.pimApi(
        `#graphql
            mutation(
                $itemId: ID!
                $language: String!
                $componentId: String!
                $content: String
            )   {
                    item {
                        updateComponent(
                            itemId: $itemId
                            language: $language
                            input: { componentId: $componentId, singleLine: { text: $content } }
                        ) {
                        id
                    }
                }
            }
        `, {
        itemId,
        language,
        componentId,
        content
      }
    )
    return data.item.updateComponent;
}