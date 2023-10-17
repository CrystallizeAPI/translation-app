import React, { useState } from "react";
import { translateArray } from "~/use-cases/fetch-translation";
import { Button, Icon } from "@crystallize/design-system";
import { getComponentByType } from "~/use-cases/get-component-type";
import { Loader } from "./loader";
import Dropdown from "./dropdown";
import { VariantTranslationForm } from "./variant-translation-form";
import ComponentFactory from "./shape-components/componentFactory";
export default function TranslationForm({
  availableLanguages,
  language,
  item,
  stories,
}: {
  availableLanguages: { code: string; name: string }[];
  language: string;
  item: any;
}) {
  const [storiesState, setStoriesState] = useState(stories);
  const [translateLanguage, setLanguage] = useState({
    from: language,
    to: "",
  });
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  const components: any = {
    singleLine: getComponentByType("singleLine", item),
    richText: getComponentByType("richText", item),
    paragraphCollection: getComponentByType("paragraphCollection", item),
    contentChunk: getComponentByType("contentChunk", item),
    componentChoice: getComponentByType("componentChoice", item),
  };

  const onTranslationCompleted = (translation) => {
    console.log(translation?.id, "in compelted", { translation });

    setStoriesState((prevState) => {
      return {
        ...prevState,
        product: {
          ...prevState.product,
          [translation.id]: {
            ...prevState.product[translation.id],
            translation: translation.translation,
          },
        },
      };
    });
  };

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const translationPromises = [];

    for (const type in components) {
      const translationPromise = translateArray(
        components[type],
        translateLanguage,
        type,
        onTranslationCompleted
      );

      translationPromises.push(translationPromise);
    }

    await Promise.all(translationPromises);

    setLoading(false);
    setFinished(true);
  };

  const handlePublishAll = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await fetch("/api/update/all-items", {
      method: "POST",
      body: JSON.stringify({
        data: [
          // ...singleLineTranslations,
          // ...richTextTranslations,
          // ...paragraphCollectionTranslations,
          // ...contentChunkTranslations,
        ],
        language: translateLanguage.to,
        itemId: item.id,
      }),
    });
  };
  return (
    <div className="min-h-[100vh] pb-24 max-w-[1200px] mx-auto px-8">
      <div className="py-8 flex flex-row gap-2 items-center pb-8 w-full border-solid border-0 border-b border-gray-200">
        <div>
          <Dropdown
            options={availableLanguages}
            selectedOption={translateLanguage.from}
            onSelectOption={(code) =>
              setLanguage({
                ...translateLanguage,
                from: code,
              })
            }
            buttonText="Select language"
          />
        </div>
        <span>to </span>
        <div className="flex items-center gap-4">
          <Dropdown
            options={availableLanguages}
            selectedOption={translateLanguage.to}
            buttonText="Select language"
            onSelectOption={(code) =>
              setLanguage({
                ...translateLanguage,
                to: code,
              })
            }
          />
        </div>
      </div>
      <details
        className="py-6 border-b border-0 border-solid border-gray-200"
        open
      >
        <summary className="justify-between flex items-center">
          <div className="font-medium">
            {finished && <div>Ferdig</div>}
            Product story
          </div>
          <div>
            <Button
              variant="elevate"
              onClick={handlePublishAll}
              prepend={<Icon.Rocket width="22" height="22" />}
              // disabled={
              //   singleLineTranslations.length === 0 &&
              //   richTextTranslations.length === 0 &&
              //   paragraphCollectionTranslations.length === 0 &&
              //   contentChunkTranslations.length === 0
              // }
            >
              Add all translations to draft
            </Button>
            <Button
              intent="action"
              onClick={handleTranslate}
              prepend={<Icon.Language width={20} height={20} />}
              disabled={!!translateLanguage.to ? false : true}
            >
              Translate
            </Button>
          </div>
        </summary>
        {Object.keys(storiesState.product).map((key) => {
          const current = storiesState.product[key];
          return <ComponentFactory cmp={current} key={key} loading={loading} />;
        })}

        {/* {singleLineTranslations &&
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
          ))} */}
        {/* {loading && <Loader />} */}
      </details>

      {/* {item?.variants?.length > 0 && (
        <VariantTranslationForm
          data={item?.variants}
          language={fromLanguage}
          toLanguage={toLanguage}
          productId={item.id}
        />
      )} */}
    </div>
  );
}
