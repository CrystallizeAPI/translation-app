import React, { useState } from "react";
import { translateArray } from "~/use-cases/fetch-translation";
import { Button, DropdownMenu, Icon } from "@crystallize/design-system";
import { getComponentByType } from "~/use-cases/get-component-type";
import { Loader } from "./loader";
import {
  SingleLine,
  RichText,
  ParagraphCollection,
  ContentChunk,
} from "./shape-components";

function TranslationForm({
  availableLanguages,
  language,
  item,
}: {
  availableLanguages: any;
  language: string;
  item: any;
}) {
  const [fromLanguage, setFromLanguage] = useState(language);
  const [toLanguage, setToLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [singleLineTranslations, setSingleLineTranslations] = useState<any[]>(
    []
  );
  const [richTextTranslations, setRichTextTranslations] = useState<any[]>([]);
  const [paragraphCollectionTranslations, setParagraphCollectionTranslations] =
    useState<any[]>([]);
  const [contentChunkTranslations, setContentChunkTranslations] = useState<
    any[]
  >([]);

  const itemData = {
    id: item?.id,
    language: toLanguage,
  };

  const components: any = {
    singleLine: getComponentByType("singleLine", item),
    richText: getComponentByType("richText", item),
    paragraphCollection: getComponentByType("paragraphCollection", item),
    contentChunk: getComponentByType("contentChunk", item),
  };

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const translationPromises = [];

    for (const type in components) {
      const translationPromise = translateArray(
        components[type],
        language,
        toLanguage,
        type
      );

      translationPromise.then((translations) => {
        switch (type) {
          case "singleLine":
            setSingleLineTranslations(translations);
            break;
          case "richText":
            setRichTextTranslations(translations);
            break;
          case "paragraphCollection":
            setParagraphCollectionTranslations(translations);
            break;
          case "contentChunk":
            setContentChunkTranslations(translations);
            break;
          default:
            break;
        }
      });

      translationPromises.push(translationPromise);
    }

    await Promise.all(translationPromises);

    setLoading(false);
  };

  const handlePublishAll = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await fetch("/api/update/all-items", {
        method: "POST",
        body: JSON.stringify({
          data: [
            ...singleLineTranslations,
            ...richTextTranslations,
            ...paragraphCollectionTranslations,
            ...contentChunkTranslations,
          ],
          language: toLanguage,
          itemId: item.id,
        }),
      }).then((res) => res.json());
}

  return (
    <div className="min-h-[100vh] pb-24 max-w-[1200px] mx-auto px-8">
      <div className="py-8 flex flex-col gap-5">
        <div className="border-solid border-0 border-b border-gray-200">
          <div className="w-full">
            <div className="flex flex-row gap-2 items-center pb-8">
              <h1 className="py-2 font-normal text-xl">Translate </h1>
              <div>
                <DropdownMenu.Root
                  content={
                    <div className="shadow bg-[#fff]  w-[150px] rounded-md py-1 flex flex-col">
                      {availableLanguages.map((lng: any) => {
                        if (lng.code === language) return;
                        return (
                          <span
                            onClick={() => setFromLanguage(lng.code)}
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
                    <span className="min-w-[100px]">
                      {fromLanguage ?? (
                        <span className="italic font-normal mx-2">
                          Select language
                        </span>
                      )}
                    </span>
                  </Button>
                </DropdownMenu.Root>
              </div>
              <span>to </span>
              <div className="flex items-center gap-4">
                <DropdownMenu.Root
                  content={
                    <div className="shadow bg-[#fff]  w-[150px] rounded-md py-1 flex flex-col">
                      {availableLanguages.map((lng: any) => {
                        if (lng.code === fromLanguage) return;
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
                    <span className="min-w-[100px]">
                      {toLanguage ?? (
                        <span className="italic font-normal mx-2">
                          Select language
                        </span>
                      )}
                    </span>
                  </Button>
                </DropdownMenu.Root>
              </div>
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
      <div className="mt-8">
        {singleLineTranslations &&
          singleLineTranslations.map((i: any) => (
            <SingleLine
              key={i.id}
              data={i}
              item={itemData}
              setEditedTranslation={setSingleLineTranslations}
            />
          ))}

        {richTextTranslations &&
          richTextTranslations.map((i: any) => (
            <RichText
              key={i.id}
              data={i}
              item={itemData}
              setEditedTranslation={setRichTextTranslations}
            />
          ))}

        {paragraphCollectionTranslations &&
          paragraphCollectionTranslations.map((i: any) => (
            <ParagraphCollection
              key={i.id}
              data={i}
              item={itemData}
              setEditedTranslation={setParagraphCollectionTranslations}
            />
          ))}

        {contentChunkTranslations &&
          contentChunkTranslations.map((i: any) => (
            <ContentChunk
              key={i.id}
              data={i}
              item={itemData}
              setEditedTranslation={setContentChunkTranslations}
            />
          ))}
      </div>
      {loading && <Loader />}
      <Button
        intent="action"
        onClick={handlePublishAll}
        disabled={
            singleLineTranslations.length === 0 &&
            richTextTranslations.length === 0 &&
            paragraphCollectionTranslations.length === 0 &&
            contentChunkTranslations.length === 0
        }
      >
        Add all translations to draft
      </Button>
    </div>
  );
}

export default TranslationForm;
