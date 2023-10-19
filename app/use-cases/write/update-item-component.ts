import { apiClient } from "../shared";

export async function updateItemComponent({
  itemId,
  language,
  input,
}: {
  itemId: string;
  language: string;
  input: any;
}) {
  const data = await apiClient.pimApi(
    `#graphql
      mutation($itemId: ID!, $language: String!, $input: ComponentInput!)   {
        item {
          updateComponent(itemId: $itemId, language: $language, input: $input){
            id 
          }
        }
    }`,
    {
      itemId,
      language,
      input,
    }
  );
  return data.item.updateComponent;
}
