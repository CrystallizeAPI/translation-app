import { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
    const body = await request.json();

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
                messages: body.content,
                temperature: 0.7,
            }),
        }
    );
    const chatGptResponseJson = await chatGptResponse.json();
    return chatGptResponseJson?.choices?.[0]?.message?.content
}