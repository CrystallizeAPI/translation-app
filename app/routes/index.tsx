import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TranslationView } from "~/components/translation-view";
import { apiClient } from "~/use-cases/shared";
import {
  getItemComponents,
  getAvailableLanguages,
  getVariantComponents,
} from "~/use-cases/read";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const itemId = url.searchParams.get("itemId") ?? "651fb51410fc8c0b9516655a";
  const variantSku = url.searchParams.get("variantSku") ?? undefined;
  const itemLanguageCode = url.searchParams.get("language") ?? "en";

  const availableLanguages = await getAvailableLanguages(apiClient)();

  let components;
  let properties;
  if (variantSku) {
    const data = await getVariantComponents(apiClient)(
      itemId,
      itemLanguageCode,
      variantSku
    );
    components = data?.variant?.components;
    properties = { name: data?.variant?.name ?? "" };
  } else {
    const item = await getItemComponents(apiClient)(itemId, itemLanguageCode);
    components = item?.components;
    properties = { name: item?.name ?? "" };
  }

  return json({
    itemId,
    properties,
    variantSku,
    components,
    language: itemLanguageCode,
    availableLanguages,
  });
};

export default function Index() {
  const {
    itemId,
    components,
    language,
    variantSku,
    availableLanguages,
    properties,
  } = useLoaderData<typeof loader>();

  if (!itemId || !components) {
    return <div>Something went wrong getting your item.</div>;
  }
  return (
    <div className="bg-gray-50">
      <div className="min-h-[100vh] pb-24 max-w-[1200px] mx-auto px-8">
        <TranslationView
          itemId={itemId}
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
