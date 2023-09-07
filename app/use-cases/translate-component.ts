export function createTranslateableObject(arr: any, language: string, toLanguage: string) {
    let messages = [
        {
            role: "user",
            content: `Translate the text delimited by triple quotes from ${language} to ${toLanguage} and then create an object that contains the following - type, id, and translation.`,
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
            item.content.paragraphs.map((paragraph: any) => {
                paragraph.title && messages.push(
                    {
                        role: "user",
                        content: `Type: paragraphTitle\nId: ${item.id}\n\"\"\"${paragraph.title.text}\"\"\"`
                    }
                )
                paragraph.body && messages.push(
                    {
                        role: "user",
                        content: `Type: paragraphBody\nId: ${item.id}\n\"\"\"${paragraph.body.plainText.toString()}\"\"\"`
                    }
                )
                paragraph.images && paragraph.images.map((image: any) => {
                    messages.push(
                        {
                            role: "user",
                            content: `Type: paragraphImage\nId: ${item.id}\nKey: ${image.key}\nUrl: ${image.url}`
                        }
                    )
                })
            })
        }
    })
    
    return messages;
}
