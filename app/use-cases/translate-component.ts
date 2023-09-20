export function createTranslateableObject(arr: any, language: string, toLanguage: string) {
    let messages = [
        {
            role: "user",
            content: `Translate the text delimited by triple quotes from ${language} to ${toLanguage} and then create an object that contains the following - type, id, and translation (where translation contains the translated text within the delimiters).`,
        },
    ]
    arr.map((item: any) => {
        switch (item.type) {
            case "singleLine":
                messages.push(
                    {
                        role: "user",
                        content: `Type: singleLine\nId: ${item.id}\n\"\"\"${item.content.text}\"\"\"`
                    }
                )
                break;
            case "richText":
                messages.push(
                    {
                        role: "user",
                        content: `Type: richText\nId: ${item.id}\n\"\"\"${item.content.plainText.toString()}\"\"\"`
                    }
                )
                break;
            case "paragraphCollection":
                item.content.paragraphs.map((paragraph: any, index: number) => {
                    paragraph.title && messages.push(
                        {
                            role: "user",
                            content: `Type: paragraphTitle${index}\nId: ${item.id}\n\"\"\"${paragraph.title.text}\"\"\"`
                        }
                    )
                    paragraph.body && messages.push(
                        {
                            role: "user",
                            content: `Type: paragraphBody${index}\nId: ${item.id}\n\"\"\"${paragraph.body.plainText.toString()}\"\"\"`
                        }
                    )
                    paragraph.images && paragraph.images.map((image: any) => {
                        messages.push(
                            {
                                role: "user",
                                content: `Type: paragraphImage${index}\nId: ${item.id}\n\"\"\"${image.url}\"\"\"`
                            }
                        )
                    })
                })
                break;
            case "contentChunk":
                item?.content?.chunks.map((chunk: any, index: number) => {
                    chunk.map((c: any) => {
                        c.content?.text && messages.push(
                            {
                                role: "user",
                                content: `Type: contentChunkText${index}${c.id}\nId: ${item.id}\n\"\"\"${c.content.text}\"\"\"`
                            }
                        )
                        c.content?.plainText && messages.push(
                            {
                                role: "user",
                                content: `Type: contentChunkPlainText${index}${c.id}\nId: ${item.id}\n\"\"\"${c.content.plainText.toString()}\"\"\"`
                            }
                        )
                        c.content?.images && c.content.images.map((image: any) => {
                            messages.push(
                                {
                                    role: "user",
                                    content: `Type: contentChunkImage${index}${c.id}\nId: ${item.id}\n\"\"\"${image.url}\"\"\"`
                                }
                            )
                        })
                    })
                })
            default:
                break;
        }
    })
    return messages;
}
