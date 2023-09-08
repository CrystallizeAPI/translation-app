export function createTranslateableObject(arr: any, language: string, toLanguage: string) {
    let messages = [
        {
            role: "user",
            content: `Translate the text delimited by triple quotes from ${language} to ${toLanguage} and then create an object that contains the following - type, id, and translation (where translation contains the translated text within the delimiters).`,
        },
    ]
    arr.map((item: any) => {
        if (item.type === "singleLine") {
            messages.push(
                {
                    role: "user",
                    content: `Type: singleLine\nId: ${item.id}\n\"\"\"${item.content.text}\"\"\"`
                }
            )
        }
        if (item.type === "richText") {
            messages.push(
                {
                    role: "user",
                    content: `Type: richText\nId: ${item.id}\n\"\"\"${item.content.plainText.toString()}\"\"\"`
                }
            )
        }
        if (item.type === "paragraphCollection") {
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
        }
    })
    return messages;
}
