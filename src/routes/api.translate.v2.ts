import { type ActionFunction, json } from "@remix-run/node";
import { buildServices } from "~/core/services.server";

export const action: ActionFunction = async ({ request }) => {
    const body = await request.json();
    const { backendTranslator } = await buildServices(request);
    const translation = await backendTranslator.translate(body);
    return json({ translation });
};
