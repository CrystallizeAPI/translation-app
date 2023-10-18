import { Button, Icon } from "@crystallize/design-system";
import Dropdown from "./dropdown";
import ComponentFactory from "./shape-components/componentFactory";
import type {
  Component,
  ContentChunkContent,
  ComponentChoiceContent,
} from "~/__generated__/types";
import { useTranslations } from "~/use-cases/use-translations";
import { componentType } from "./shape-components/helpers";

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
      <div className="flex py-8 flex-row justify-between border-solid  border-0 border-b border-gray-200">
        <div className="flex flex-row gap-2 items-center  w-full ">
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
        <div className="flex gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs whitespace-nowrap flex items-center gap-2">
              <input type="checkbox" />
              Add all translations to {language.to} draft
            </label>
            <label className="text-xs flex items-center gap-2">
              <input type="checkbox" />
              Include all variants
            </label>
          </div>

          <Button
            intent="action"
            onClick={handleTranslate}
            prepend={<Icon.Language width={20} height={20} />}
            disabled={translateLanguage.to ? false : true}
          >
            Translate
          </Button>
        </div>
      </div>

      <div className="py-6 border-b border-0 border-solid border-gray-200">
        <div className="space-y-4">
          {componentsWithTranslation.map((component) => {
            const { type } = component;

            if (type === "contentChunk") {
              return (
                <div key={component.id} className="space-y-4">
                  {(component.content as ContentChunkContent)?.chunks.map(
                    (chunk, index) => {
                      return (
                        <div
                          key={index}
                          className="bg-s-pink-100  pl-4 pt-4 rounded-md"
                        >
                          <div className="flex capitalize h-7 pb-4 items-center font-medium text-sm gap-2">
                            <div className="-mr-1">
                              {componentType["contentChunk"]}
                            </div>
                            <span className="font-medium text-xs text-s-pink-500">
                              {component?.id} {`#${index + 1}`}
                            </span>
                          </div>

                          <div className="overflow-hidden rounded-tl-md">
                            {chunk.map((chunkComponent) => (
                              <ComponentFactory
                                structuralColor="text-s-pink-500"
                                isStructuralComponent
                                key={chunkComponent.id}
                                component={chunkComponent}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              );
            }

            if (type === "componentChoice") {
              return (
                <div
                  className="pl-4 pt-4 rounded-md bg-purple-100"
                  key={component.id}
                >
                  <div className="flex capitalize h-7 pb-4 items-center font-medium text-sm gap-2">
                    <div className="-mr-1">{componentType[type]}</div>
                    <span className="font-medium text-xs text-purple-500">
                      {component?.id}
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-tl-md">
                    <ComponentFactory
                      isStructuralComponent
                      structuralColor="text-purple-500"
                      component={
                        (component.content as ComponentChoiceContent)
                          .selectedComponent
                      }
                    />
                  </div>
                </div>
              );
            }

            return (
              <div key={component.id}>
                <ComponentFactory component={component} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
