export const fetchTranslation = async (text: string, language: string, toLanguage: string) => {
  return await fetch("/api/translate/v2", {
    method: "POST",
    body: JSON.stringify({
      role: "user",
      content: `Translate the text delimited by triple quotes from ${language} to ${toLanguage}. The returned translation should contain no quotes.\n\n\"\"\"${text}\"\"\"`
    }),
  });
}

export const singleLineTranslation = async (component: any, language: string, toLanguage: string) => {
  const translation = component?.content?.text && await fetchTranslation(component.content.text, language, toLanguage);
  return (
    {
      id: component.id,
      type: "singleLine",
      translation: await translation.text(),
    }
  )

}

export const richTextTranslation = async (component: any, language: string, toLanguage: string) => {
  const translation = await fetchTranslation(component?.content?.plainText.toString(), language, toLanguage);
  return (
    {
      id: component.id,
      type: "richText",
      translation: await translation.text(),
    }
  )
}

export const paragraphCollectionTranslation = async (component: any, language: string, toLanguage: string) => {
  let data = {
    id: component.id,
    type: "paragraphCollection",
    paragraphs: component?.content?.paragraphs.map(async (paragraph: any) => {
      const title = paragraph?.title && await fetchTranslation(paragraph.title.text, language, toLanguage);
      const body = paragraph?.body && await fetchTranslation(paragraph.body.plainText.toString(), language, toLanguage);
      return {
        title: await title.text(),
        body: await body.text(),
        images: paragraph?.images
      }
    })
  }
  data.paragraphs = await Promise.all(data.paragraphs);
  return data;
}

export const contentChunkTranslation = async (component: any, language: string, toLanguage: string) => {
  const data = {
    id: component.id,
    type: "contentChunk",
    chunks: [] as any[],
  };
  component?.content?.chunks?.map(async (chunk: any) => {
    chunk?.map(async (item: any) => {
      switch (item.type) {
        case "singleLine":
          const translation = item?.content?.text && await fetchTranslation(item.content.text, language, toLanguage);
          const comp = {
            id: item.id,
            type: "singleLine",
            translation: await translation.text(),
          };
          data.chunks.push(comp);
          break;
        case "richText":
          const richTranslation = await fetchTranslation(item.content.plainText.toString(), language, toLanguage);
          let richComp = {
            id: item.id,
            type: "richText",
            translation: await richTranslation.text(),
          };
          richComp = await richComp;
          data.chunks.push(richComp);
          break;
        case "paragraphCollection":
          const paragraphTranslation = await paragraphCollectionTranslation(item, language, toLanguage);
          data.chunks.push(paragraphTranslation);
          break;
        default:
          break;
      }
    })
  })
  
  data.chunks = await Promise.all(data.chunks);
  console.log("data", data);

  return data;
};

export const choiceComponentTranslation = async (component: any, language: string, toLanguage: string) => {
  const data = {
    id: component.id,
    type: "componentChoice",
    selectedComponent: {} as any,
  }
  const selectedChoice = component?.content?.selectedComponent
  switch (selectedChoice?.type) {
    case "singleLine":
      const translation = await fetchTranslation(selectedChoice.content.text, language, toLanguage);
      const comp = {
        id: selectedChoice.id,
        type: "singleLine",
        translation: await translation.text(),
      };
      data.selectedComponent = comp;
      break;
    case "richText":
      const richTranslation = await fetchTranslation(selectedChoice.content.plainText.toString(), language, toLanguage);
      const richComp = {
        id: selectedChoice.id,
        type: "richText",
        translation: await richTranslation.text(),
      };
      data.selectedComponent = richComp;
      break;
    default:
      break
  }
  data.selectedComponent = await data.selectedComponent
  return data;
}

export const translateArray = async (components: any[], language: string, toLanguage: string, type: string) => {
  const translations = await Promise.all(components.map(async (component) => {
    switch (type) {
      case "singleLine":
        return await singleLineTranslation(component, language, toLanguage);
      case "richText":
        return await richTextTranslation(component, language, toLanguage);
      case "paragraphCollection":
        return await paragraphCollectionTranslation(component, language, toLanguage);
      case "contentChunk":
        return await contentChunkTranslation(component, language, toLanguage);
      case "componentChoice":
        return await choiceComponentTranslation(component, language, toLanguage);
      default:
        return await singleLineTranslation(component, language, toLanguage);
    };
  }));

  return translations;
}