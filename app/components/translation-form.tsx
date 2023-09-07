import React, { useState } from "react";
import {
  createTranslateableObject,
  translateUsingChatGpt,
} from "~/use-cases/translate-component";
import DisplayTranslations from "./shape-components/display-translations";

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
  const [prompt, setPrompt] = useState("");
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

  const content = createTranslateableObject(
    [singleLineComponents, richTextComponents, paragraphComponents].flat(),
    language,
    toLanguage
  );

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    let translation = await translateUsingChatGpt(content);
    translation = translation.replace("(\\\\n|\\\\r)", "");
    let translationArr = translation.split("\n\n");
    let jsonArr = translationArr.map((item: any) => {
      return JSON.parse(item);
    });
    setTranslations(jsonArr);
    setLoading(false);
  };

  return (
    <>
      <div className="max-w-[500px] mx-auto py-8 flex flex-col gap-5">
        <p>Translate from: {language}</p>
        <select
          value={toLanguage}
          onChange={(e) => setToLanguage(e.target.value)}
          className="border border-gray-300 p-2"
        >
          {availableLanguages.map((language: any) => {
            return (
              <option value={language.code} key={language.code}>
                {language.name}
              </option>
            );
          })}
        </select>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter text to translate"
          className="border border-gray-300 p-2"
        />
        <button
          onClick={handleTranslate}
          className="bg-[#000] py-1 px-4 text-[#fff]"
        >
          Translate
        </button>
      </div>
      {translations.length > 0 && (
        <DisplayTranslations translations={translations} item={itemData} />
      )}
      {loading && (
        <div className="flex items-center justify-center w-full">
          <div
            className="w-12 h-12 rounded-full animate-spin
       border-2 border-dashed border-gray-500 border-t-transparent"
          ></div>
        </div>
      )}
    </>
  );
}

export default TranslationForm;
