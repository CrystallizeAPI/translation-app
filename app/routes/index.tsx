import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TranslationView } from "~/components/translation-view";
import { getApi } from "~/use-cases/api";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const api = await getApi(request);
  const url = new URL(request.url);
  const itemId = url.searchParams.get("itemId");
  const itemLanguageCode = url.searchParams.get("language") ?? "en";

  const item = await api.getItemComponents(itemId!, itemLanguageCode!);
  const availableLanguages = await api.getAvailableLanguages();

  return json({
    item,
    language: itemLanguageCode,
    availableLanguages,
  });
};

export default function Index() {
  const { item, language, availableLanguages } = useLoaderData<typeof loader>();

  if (!item || !item.components) {
    return <div>Something went wrong getting your item.</div>;
  }

  return (
    <div className="bg-gray-50">
      <div className="min-h-[100vh] pb-24 max-w-[1200px] mx-auto px-8">
        <TranslationView
          itemId={item.id}
          language={language}
          components={item.components}
          availableLanguages={availableLanguages}
        />
      </div>
    </div>
  );
}
