import React, { useState } from "react";
import { createTranslateableObject } from "~/use-cases/translate-component";
import DisplayTranslations from "./shape-components/display-translations";
import { Button, DropdownMenu, Icon } from "@crystallize/design-system";
function TranslationForm({
  availableLanguages,
  language,
  item,
}: {
  availableLanguages: any;
  language: string;
  item: any;
}) {
  const [toLanguage, setToLanguage] = useState(null);
  const [translations, setTranslations] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const itemData = {
    id: item?.id,
    language: toLanguage,
  };

  const getComponentByType = (type: string) => {
    return item?.components?.filter((comp: any) => {
      return comp.type === type;
    });
  };

  const singleLineComponents = getComponentByType("singleLine");

  const richTextComponents = getComponentByType("richText");

  const paragraphComponents = getComponentByType("paragraphCollection");

  const contentChunkComponents = getComponentByType("contentChunk");

  const content = createTranslateableObject(
    [
      singleLineComponents,
      richTextComponents,
      paragraphComponents,
      contentChunkComponents,
    ].flat(),
    language,
    toLanguage
  );

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    let response = await fetch("/api/translate", {
      method: "POST",
      body: JSON.stringify({
        content,
      }),
    });

    let translation = await response.json();
    translation = translation.replace("(\\\\n|\\\\r)", "");
    let translationArr = translation.split("\n\n");
    let jsonArr = translationArr.map((item: any) => {
      return JSON.parse(item);
    });
    setTranslations(jsonArr);

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
        {translations.length > 0 && (
          <div className="max-w-[1200px] w-full mx-auto">
            <DisplayTranslations translations={translations} item={itemData} />
          </div>
        )}
      </div>
      {loading && (
        <div className="flex items-center justify-center w-full">
          <div
            className="w-12 h-12 rounded-full animate-spin
       border-2 border-dashed border-gray-500 border-t-transparent"
          ></div>
        </div>
      )}
    </div>
  );
}

export default TranslationForm;
