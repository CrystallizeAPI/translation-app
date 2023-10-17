import { Button, Icon } from "@crystallize/design-system";
import Dropdown from "./dropdown";
import ComponentFactory from "./shape-components/componentFactory";
import type {
  Component,
  ContentChunkContent,
  ComponentChoiceContent,
} from "~/__generated__/types";
import { useTranslations } from "~/use-cases/use-translations";

type TranslationFormProps = {
  language: string;
  components: Component[];
  availableLanguages: { code: string; name: string }[];
};

export default function TranslationForm({
  language,
  components,
  availableLanguages,
}: TranslationFormProps) {
  const {
    componentsWithTranslation,
    handleTranslate,
    translateLanguage,
    onChangeLanguage,
  } = useTranslations({ language, components });

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
              onChangeLanguage({ ...translateLanguage, from: code })
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
              onChangeLanguage({ ...translateLanguage, to: code })
            }
          />
        </div>
      </div>
      <details
        className="py-6 border-b border-0 border-solid border-gray-200"
        open
      >
        <summary className="justify-between flex items-center">
          <div className="font-medium">Product story</div>
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
              disabled={translateLanguage.to ? false : true}
            >
              Translate
            </Button>
          </div>
        </summary>
        {componentsWithTranslation.map((component) => {
          if (component.type === "contentChunk") {
            return (
              <div key={component.id} className="space-y-4">
                {(component.content as ContentChunkContent)?.chunks.map(
                  (chunk, index) => {
                    return (
                      <div key={index} className="bg-purple-200 p-4 rounded">
                        {chunk.map((chunkComponent) => (
                          <ComponentFactory
                            key={chunkComponent.id}
                            component={chunkComponent}
                          />
                        ))}
                      </div>
                    );
                  }
                )}
              </div>
            );
          }

          if (component.type === "componentChoice") {
            return (
              <ComponentFactory
                key={component.id}
                component={
                  (component.content as ComponentChoiceContent)
                    .selectedComponent
                }
              />
            );
          }

          return <ComponentFactory key={component.id} component={component} />;
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
