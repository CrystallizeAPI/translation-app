import React, { Suspense, useEffect, useState } from "react";
import {
  richTextTranslation,
  singleLineTranslation,
  translateArray,
} from "~/use-cases/fetch-translation";
import SingleLine from "./shape-components/single-line";
import { Button, DropdownMenu, Icon } from "@crystallize/design-system";
import RichText from "./shape-components/rich-text";
import ParagraphCollection from "./shape-components/paragraph-collection";
import { getComponentByType } from "~/use-cases/get-component-type";
import { Loader } from "./loader";
import ContentChunk from "./shape-components/content-chunk";

function TranslationForm({
  availableLanguages,
  language,
  item,
}: {
  availableLanguages: any;
  language: string;
  item: any;
}) {
  const [toLanguage, setToLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [singleLineTranslations, setSingleLineTranslations] = useState<any>([]);
  const [richTextTranslations, setRichTextTranslations] = useState<any>([]);
  const [paragraphCollectionTranslations, setParagraphCollectionTranslations] =
    useState<any>([]);
  const [contentChunkTranslations, setContentChunkTranslations] = useState<any>(
    []
  );

  const itemData = {
    id: item?.id,
    language: toLanguage,
  };

  const singleLineComponents = getComponentByType("singleLine", item);

  const richTextComponents = getComponentByType("richText", item);

  const paragraphComponents = getComponentByType("paragraphCollection", item);

  const contentChunkComponents = getComponentByType("contentChunk", item);

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const singleLine = await translateArray(
      singleLineComponents,
      language,
      toLanguage,
      "singleLine"
    );
    setSingleLineTranslations(singleLine);

    const richText = await translateArray(
      richTextComponents,
      language,
      toLanguage,
      "richText"
    );
    setRichTextTranslations(richText);

    const paragraphCollection = await translateArray(
      paragraphComponents,
      language,
      toLanguage,
      "paragraphCollection"
    );
    setParagraphCollectionTranslations(paragraphCollection);

    const contentChunk = await translateArray(
      contentChunkComponents,
      language,
      toLanguage,
      "contentChunk"
    );
    setContentChunkTranslations(contentChunk);

    setLoading(false);
  };

  return (
    <div className="bg-gray-50  min-h-[100vh] pb-24">
      <div className=" py-8 flex flex-col gap-5">
        <div className="border-solid border-0 border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto w-full">
            <h1 className="py-2 font-normal text-xl">
              Translate{" "}
              <span className="text-cyan-600 font-bold">{language}</span> to
            </h1>
            <div className="flex items-center gap-4  pb-8 ">
              <DropdownMenu.Root
                content={
                  <div className="shadow bg-[#fff]  w-[180px] rounded-md py-1 flex flex-col">
                    {availableLanguages.map((lng: any) => {
                      if (lng.code === language) return;
                      return (
                        <span
                          onClick={() => setToLanguage(lng.code)}
                          key={lng.code}
                          className="font-medium px-2 py-1 text-sm text-center cursor-pointer hover:bg-purple-50"
                        >
                          {lng.name} ({lng.code})
                        </span>
                      );
                    })}
                  </div>
                }
              >
                <Button variant="elevate" append={<Icon.Arrow />}>
                  <span className="min-w-[120px]">
                    {toLanguage ?? (
                      <span className="italic font-normal mx-2">
                        Select language
                      </span>
                    )}
                  </span>
                </Button>
              </DropdownMenu.Root>

              <Button
                intent="action"
                onClick={handleTranslate}
                prepend={<Icon.Language width={20} height={20} />}
                disabled={!!toLanguage ? false : true}
              >
                Translate
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="px-12 mt-8">
        <Suspense fallback={<h2>Fetching single line...</h2>}>
          {singleLineTranslations &&
            singleLineTranslations.map((i: any) => (
              <SingleLine key={i.id} data={i} item={itemData} />
            ))}
        </Suspense>
        <Suspense fallback={<h2>Fetching rich text...</h2>}>
          {richTextTranslations &&
            richTextTranslations.map((i: any) => (
              <RichText key={i.id} data={i} item={itemData} />
            ))}
        </Suspense>
        <Suspense fallback={<h2>Translating paragraph collection</h2>}>
          {paragraphCollectionTranslations &&
            paragraphCollectionTranslations.map((i: any) => (
              <ParagraphCollection key={i.id} data={i} item={itemData} />
            ))}
        </Suspense>
        {contentChunkTranslations &&
          contentChunkTranslations.map((i: any) => {
            console.log("i", i);
            return <ContentChunk key={i.id} data={i} item={itemData} />;
          })}
      </div>
      {loading && <Loader />}
    </div>
  );
}

export default TranslationForm;
