import { ActionFunction, json } from "@remix-run/node";


//v2 for streaming purposes, v1 for non-streaming
export const action: ActionFunction = async ({ request }) => {
    const body = await request.json();

    try {
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
                    stream: true,
                }),
            }
        );

        if (!chatGptResponse.ok) {
            throw new Error("ChatGPT request failed");
        }
        const textStream = await chatGptResponse.text();
        const jsonResponse = JSON.parse(textStream);
        return json({ data: jsonResponse }, { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error(error);
        return json({ error: "An error occurred" }, { status: 500 });
    }
}

