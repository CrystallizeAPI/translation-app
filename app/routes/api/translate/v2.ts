import { ActionFunction, json } from "@remix-run/node";
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from "~/use-cases/stream-compat.server";

//v2 for streaming purposes, v1 for non-streaming
export const action: ActionFunction = async ({ request }) => {
    const body = await request.json();
    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [body],
                    temperature: 0.7,
                    stream: true
                }),
            }
        );
        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);

    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error;
            return json({ name, status, headers, message }, { status });
        } else {
            throw error;
        }
    }
}

