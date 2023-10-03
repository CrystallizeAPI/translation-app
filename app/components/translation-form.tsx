import React, { useState } from "react";
import { translateArray } from "~/use-cases/fetch-translation";
import { Button, Icon } from "@crystallize/design-system";
import { getComponentByType } from "~/use-cases/get-component-type";
import { Loader } from "./loader";
import {
  SingleLine,
  RichText,
  ParagraphCollection,
  ContentChunk,
  ComponentChoice,
} from "./shape-components";
import Dropdown from "./dropdown";
import { VariantTranslationForm } from "./variant-translation-form";

export default function TranslationForm({
  availableLanguages,
  language,
  item,
}: {
  availableLanguages: { code: string; name: string }[];
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
  const [componentChoiceTranslations, setComponentChoiceTranslations] =
    useState<any[]>([]);

  const itemData = {
    id: item?.id,
    language: toLanguage,
  };

  const components: any = {
    singleLine: getComponentByType("singleLine", item),
    richText: getComponentByType("richText", item),
    paragraphCollection: getComponentByType("paragraphCollection", item),
    contentChunk: getComponentByType("contentChunk", item),
    componentChoice: getComponentByType("componentChoice", item),
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
          case "componentChoice":
            setComponentChoiceTranslations(translations);
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

  const handleLanguageChange = (
    code: string,
    field: "fromLanguage" | "toLanguage"
  ) => {
    field === "fromLanguage" ? setFromLanguage(code) : setToLanguage(code);
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
    });
  };

  return (
    <div className="min-h-[100vh] pb-24 max-w-[1200px] mx-auto px-8">
      <div className="py-8 flex flex-row gap-2 items-center pb-8 w-full border-solid border-0 border-b border-gray-200">
        <h1 className="py-2 font-normal text-xl">Translate</h1>
        <div>
          <Dropdown
            options={availableLanguages}
            selectedOption={fromLanguage}
            onSelectOption={(code) =>
              handleLanguageChange(code, "fromLanguage")
            }
            buttonText="Select language"
          />
        </div>
        <span>to </span>
        <div className="flex items-center gap-4">
          <Dropdown
            options={availableLanguages}
            selectedOption={toLanguage}
            onSelectOption={(code) => handleLanguageChange(code, "toLanguage")}
            buttonText="Select language"
          />
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
        {componentChoiceTranslations &&
          componentChoiceTranslations.map((i: any) => (
            <ComponentChoice
              key={i.id}
              data={i}
              item={itemData}
              setEditedTranslation={setComponentChoiceTranslations}
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
      {item?.variants?.length > 0 && (
        <VariantTranslationForm
          data={item?.variants}
          language={fromLanguage}
          toLanguage={toLanguage}
          productId={item.id}
        />
      )}
    </div>
  );
}
