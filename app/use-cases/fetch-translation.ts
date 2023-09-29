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
    const translation = await fetchTranslation(component.content.text, language, toLanguage);
    return (
        {
            id: component.id,
            type: "singleLine",
            translation: await translation.text(),
        }
    )
}

export const richTextTranslation = async (component: any, language: string, toLanguage: string) => {
    const translation = await fetchTranslation(component.content.plainText.toString(), language, toLanguage);
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

    for (const chunk of component?.content?.chunks || []) {
        for (const item of chunk || []) {
            switch (item.type) {
                case "singleLine":
                    const translation = await fetchTranslation(item.content.text, language, toLanguage);
                    const comp = {
                        id: item.id,
                        type: "singleLine",
                        translation: await translation.text(),
                    };
                    data.chunks.push(comp);
                    break;
                case "richText" && item.content:
                    const richTranslation = await fetchTranslation(item.content.plainText.toString(), language, toLanguage);
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
            default:
                return await singleLineTranslation(component, language, toLanguage);
        };
    }));

    return translations;
}