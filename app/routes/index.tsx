import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getItemFromPath } from "~/use-cases/read/get-item-from-path";
import { getAvailableLanguages } from "~/use-cases/read/get-available-languages";
import TranslationForm from "~/components/translation-form";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const itemPath = url.searchParams.get("item");
  const itemLanguageCode = url.searchParams.get("language") ?? "en";

  const data = await getItemFromPath(itemPath!, itemLanguageCode!);
  const availableLanguages = await getAvailableLanguages();

  return json({
    item: data.catalogue,
    language: itemLanguageCode,
    availableLanguages,
  });
};

export default function Index() {
  const { item, language, availableLanguages } = useLoaderData();

  return (
    <div className="bg-gray-50">
      <TranslationForm
        language={language}
        availableLanguages={availableLanguages}
        components={item.components}
      />
    </div>
  );
}
