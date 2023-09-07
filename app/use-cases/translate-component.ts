import OpenAI from "openai";
import SingleLine from "~/components/shape-components/single-line";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function translateUsingChatGpt(content: any) {
//   const completion = await openai.chat.completions.create({
//     messages: [{ role: "user", content }],
//     model: "gpt-3.5-turbo",
//   });
//   return completion.choices;
// }

export async function translateUsingChatGpt(content: any) {
    const chatGptResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: content,
                temperature: 0.7,
            }),
        }
    );
    const chatGptResponseJson = await chatGptResponse.json();
    return chatGptResponseJson?.choices?.[0]?.message?.content;
}

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
            })
        }
    })
    return messages;
}
