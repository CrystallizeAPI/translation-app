import { Preferences } from "./types";

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
  return await fetch("/api/translate/v2", {
    method: "POST",
    body: JSON.stringify({
      role: "user",
      content: `Translate the text delimited by triple quotes from ${from} to ${to}. ${preferences.customPromptFromUser}. The returned translation should contain no quotes.\n\n\"\"\"${text}\"\"\"`,
    }),
  });
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
    translation: (await translation.text()) || "",
  };
};

export const richTextTranslation = async (
  component: any,
  translateLanguage: Language,
  preferences: Preferences
) => {
  const translation = await fetchTranslation(
    component?.content?.plainText.toString(),
    translateLanguage,
    preferences
  );
  return {
    id: component.id,
    type: "richText",
    translation: await translation.text(),
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
            : undefined,
          paragraph?.body
            ? fetchTranslation(
                paragraph.body.plainText.toString(),
                translateLanguage,
                preferences
              )
            : undefined,
        ]);

        return {
          title: await title?.text(),
          body: await body?.text(),
          images: paragraph?.images,
        };
      })
    ),
  };
};

export const contentChunkTranslation = async (
  component: any,
  translateLanguage: Language,
  preferences: Preferences
) => {
  const data = {
    id: component.id,
    type: "contentChunk",
    chunks: [] as any[],
  };

  for (const chunk of component?.content?.chunks || []) {
    for (const item of chunk || []) {
      switch (item.type) {
        case "singleLine":
          const translation = await fetchTranslation(
            item.content?.text,
            translateLanguage,
            preferences
          );
          const comp = {
            id: item.id,
            type: "singleLine",
            translation: await translation?.text(),
          };
          data.chunks.push(comp);
          break;
        case "richText" && item.content:
          const richTranslation = await fetchTranslation(
            item.content.plainText.toString(),
            translateLanguage,
            preferences
          );
          const richComp = {
            id: item.id,
            type: "richText",
            translation: await richTranslation.text(),
          };
          data.chunks.push(richComp);
          break;
        default:
          break;
      }
    }
  }

  return data;
};

export const choiceComponentTranslation = async (
  component: any,
  translateLanguage: Language,
  preferences: Preferences
) => {
  const data = {
    id: component.id,
    type: "componentChoice",
    selectedComponent: {} as any,
  };
  const selectedChoice = component?.content?.selectedComponent;
  switch (selectedChoice?.type) {
    case "singleLine":
      const translation = await fetchTranslation(
        selectedChoice.content.text,
        translateLanguage,
        preferences
      );
      const comp = {
        id: selectedChoice.id,
        type: "singleLine",
        translation: await translation.text(),
      };
      data.selectedComponent = comp;
      break;
    case "richText":
      const richTranslation = await fetchTranslation(
        selectedChoice.content.plainText.toString(),
        translateLanguage,
        preferences
      );
      const richComp = {
        id: selectedChoice.id,
        type: "richText",
        translation: await richTranslation.text(),
      };
      data.selectedComponent = richComp;
      break;
    default:
      break;
  }
  data.selectedComponent = await data.selectedComponent;
  return data;
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
