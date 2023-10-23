import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { type Component, ItemType } from "~/__generated__/types";
import { useLoaderData } from "@remix-run/react";
import { toComponentInput } from "~/use-cases/to-component-input";
import { TranslationView } from "~/components/translation-view";
import { getApi } from "~/use-cases/api";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const api = await getApi(request);
  const url = new URL(request.url);
  const itemId = url.searchParams.get("itemId");
  const language = url.searchParams.get("language");
  const variantSku = url.searchParams.get("variantSku") ?? undefined;

  if (!itemId || !language) {
    // TODO: Redirect to a new page where the user can insert the ID manually
    throw redirect("/invalid");
  }

  // TODO: make this part of the request to get components or use Promise.all
  const availableLanguages = await api.getAvailableLanguages();

  let components;
  let properties;
  let itemType = ItemType.Product;

  if (variantSku) {
    const data = await api.getVariantComponents(itemId, language, variantSku);
    components = data?.variant?.components;
    properties = [{ type: "name", content: data?.variant?.name ?? "" }];
  } else {
    const item = await api.getItemComponents(itemId, language);
    components = item?.components;
    properties = [{ type: "name", content: item?.name ?? "" }];
    itemType = item?.type as ItemType;
  }

  return json({
    itemId,
    itemType,
    properties,
    variantSku,
    components,
    language,
    availableLanguages,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const api = await getApi(request);

  try {
    const body = await request.formData();
    const { type, itemId, itemType, language, translation, variantSku } =
      JSON.parse((body.get("data") ?? "") as string);

    if (type === "property") {
      await api.updateItemName({
        id: itemId,
        itemType,
        language,
        input: { name: translation.content },
      });

      return json({ itemId, language, type: "refetchItem" });
    }

    const input = toComponentInput(translation as Component);

    if (variantSku) {
      await api.updateVariantComponent({
        input,
        language,
        sku: variantSku,
        productId: itemId,
      });
      return json({ itemId, language, type: "refetchItemVarianComponents" });
    } else {
      await api.updateItemComponent({ itemId, language, input });
      return json({ itemId, language, type: "refetchItemComponents" });
    }
  } catch (e) {
    console.log(e);
  }

  return null;
};

export default function Index() {
  const {
    itemId,
    itemType,
    components,
    language,
    variantSku,
    availableLanguages,
    properties,
  } = useLoaderData<typeof loader>();

  if (!itemId) {
    return <div>Something went wrong getting your item.</div>;
  }
  return (
    <div className="bg-gray-50">
      <div className="min-h-[100vh] pb-24 max-w-[1200px] mx-auto px-8">
        <TranslationView
          itemId={itemId}
          itemType={itemType}
          variantSku={variantSku}
          language={language}
          components={components}
          availableLanguages={availableLanguages}
          properties={properties}
        />
      </div>
    </div>
  );
}
