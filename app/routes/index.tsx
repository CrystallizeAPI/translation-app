import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ShapeComponents from "../components/shape-components";

import { getItemFromPath } from "~/hooks/get-item-from-path";
import { getTenantInformation } from "~/hooks/get-tenant-information";
export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const itemPath = url.searchParams.get("item");
  const itemLanguageCode = url.searchParams.get("language");

  const data = await getItemFromPath(itemPath, itemLanguageCode);
  // const tenant = await getTenantInformation();

  return json({
    // chatGpt,
    item: data.catalogue,
    language: itemLanguageCode || "en",
    path: itemPath,
  });
};

export default function Index() {
  const { item, language, path, chatGpt } = useLoaderData();
  return (
    <>
      <ShapeComponents {...item} />{" "}
    </>
  );
}
