type Language = {
  from: string;
  to: string;
};

export const fetchTranslation = async (
  text: string,
  translateLanguage: Language
) => {
  const { from, to } = translateLanguage;
  return await fetch("/api/translate/v2", {
    method: "POST",
    body: JSON.stringify({
      role: "user",
      content: `Translate the text delimited by triple quotes from ${from} to ${to}. The returned translation should contain no quotes.\n\n\"\"\"${text}\"\"\"`,
    }),
  });
};

export const singleLineTranslation = async (
  component: any,
  translateLanguage: Language
) => {
  const translation =
    component?.content?.text &&
    (await fetchTranslation(component.content.text, translateLanguage));
  return {
    id: component.id,
    type: "singleLine",
    translation: (await translation.text()) || "",
  };
};

export const richTextTranslation = async (
  component: any,
  translateLanguage: Language
) => {
  const translation = await fetchTranslation(
    component?.content?.plainText.toString(),
    translateLanguage
  );
  return {
    id: component.id,
    type: "richText",
    translation: await translation.text(),
  };
};

export const paragraphCollectionTranslation = async (
  component: any,
  translateLanguage: Language
) => {
  let data = {
    id: component.id,
    type: "paragraphCollection",
    translation: component?.content?.paragraphs.map(async (paragraph: any) => {
      const title =
        paragraph?.title &&
        (await fetchTranslation(
          paragraph?.title?.text ?? "",
          translateLanguage
        ));
      const body =
        paragraph?.body &&
        (await fetchTranslation(
          paragraph.body.plainText.toString(),
          translateLanguage
        ));

      return {
        title: await title?.text(),
        body: await body?.text(),
        images: paragraph?.images,
      };
    }),
  };
  data.translation = await Promise.all(data.translation);
  console.log({ data });
  return data;
};

export const contentChunkTranslation = async (
  component: any,
  translateLanguage: Language
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
            translateLanguage
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
            translateLanguage
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
  translateLanguage: Language
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
        translateLanguage
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
        translateLanguage
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
  component: any
) => {
  switch (component.type) {
    case "singleLine":
      return await singleLineTranslation(component, translateLanguage);
    case "richText":
      return await richTextTranslation(component, translateLanguage);
    case "paragraphCollection":
      return await paragraphCollectionTranslation(component, translateLanguage);
    default:
      return null;
  }
};
