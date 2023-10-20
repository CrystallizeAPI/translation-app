import { apiClient } from "../shared";

export async function updateVariantComponent({
  productId,
  language,
  sku,
  input,
}: {
  productId: string;
  language: string;
  sku: string;
  input: any;
}) {
  const data = await apiClient.pimApi(
    `#graphql
      mutation($productId: ID!, $language: String!, $sku: String!, $input: ComponentInput!)   {
        product {
          updateVariantComponent(productId: $productId, language: $language, sku: $sku, input: $input){
            id 
          }
        }
    }`,
    {
      productId,
      language,
      sku,
      input,
    }
  );
  return data.product?.updateComponent;
}
