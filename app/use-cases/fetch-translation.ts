import type { Preferences } from "./types";

type Language = {
  from: string;
  to: string;
};

export const fetchTranslation = async (
  text: string,
  translateLanguage: Language,
  preferences: Preferences
) => {
  const { from, to } = translateLanguage;
  const chatgpt = await fetch("/api/translate/v2", {
    method: "POST",
    body: JSON.stringify({
      role: "user",
      content: `Translate from ${from} to ${to} (delimited with XML tags). ${
        preferences.customPromptFromUser
          ? `And ${preferences.customPromptFromUser}`
          : ""
      }. <translation>${text}</translation>`,
    }),
  });
  const result = await chatgpt.text();

  return result.replace(/<[^>]*>/g, "");
};

export const singleLineTranslation = async (
  component: any,
  translateLanguage: Language,
  preferences: Preferences
) => {
  const translation =
    component?.content?.text &&
    (await fetchTranslation(
      component.content.text,
      translateLanguage,
      preferences
    ));
  return {
    id: component.id,
    type: "singleLine",
    translation: translation || "",
  };
};

export const richTextTranslation = async (
  component: any,
  translateLanguage: Language,
  preferences: Preferences
) => {
  if (!component?.content?.plainText) {
    return {
      id: component.id,
      type: "richText",
      translation: null,
    };
  }
  const translation = await fetchTranslation(
    component?.content?.plainText.toString() ?? "",
    translateLanguage,
    preferences
  );
  return {
    id: component.id,
    type: "richText",
    translation: [translation],
  };
};

export const paragraphCollectionTranslation = async (
  component: any,
  translateLanguage: Language,
  preferences: Preferences
) => {
  return {
    id: component.id,
    type: "paragraphCollection",
    translation: await Promise.all(
      component?.content?.paragraphs.map(async (paragraph: any) => {
        const [title, body] = await Promise.all([
          paragraph?.title
            ? fetchTranslation(
                paragraph?.title?.text ?? "",
                translateLanguage,
                preferences
              )
            : null,
          paragraph?.body
            ? fetchTranslation(
                paragraph.body.plainText.toString(),
                translateLanguage,
                preferences
              )
            : null,
        ]);

        return {
          title,
          body,
          images: paragraph?.images,
        };
      })
    ),
  };
};

export const getComponentTranslation = async (
  translateLanguage: Language,
  component: any,
  preferences: Preferences
) => {
  switch (component.type) {
    case "singleLine":
      return await singleLineTranslation(
        component,
        translateLanguage,
        preferences
      );
    case "richText":
      return await richTextTranslation(
        component,
        translateLanguage,
        preferences
      );
    case "paragraphCollection":
      return await paragraphCollectionTranslation(
        component,
        translateLanguage,
        preferences
      );
    default:
      return null;
  }
};
