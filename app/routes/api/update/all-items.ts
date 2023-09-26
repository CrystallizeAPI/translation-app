import { ActionFunction } from "@remix-run/node";
import { json } from "remix-utils";
import { updateContentChunk } from "~/use-cases/write/update-content-chunk";
import { updateParagraphCollection } from "~/use-cases/write/update-paragraph-collection";
import { updateRichTextComponent } from "~/use-cases/write/update-rich-text-component";
import { updateSingleLineComponent } from "~/use-cases/write/update-single-line-component";

export const action: ActionFunction = async ({ request }) => {
    const body = await request.json();

    const { itemId, language, data } = body;

    try {
        data?.forEach(async (component: any) => {
            switch (component.type) {
                case "singleLine":
                    await updateSingleLineComponent(itemId, language, component.id, component.translation);
                    break;
                case "richText":
                    await updateRichTextComponent(itemId, language, component.id, component.translation);
                    break;
                case "paragraphCollection":
                    component?.paragraphs && component.paragraphs?.forEach(async (paragraph: any) => {
                        let content = {
                            title: { text: paragraph.title || ""},
                            body: { html: paragraph.body || ""},
                            images: paragraph.images.map((image: any) => {
                                return { key: image.key };
                            }) || [],
                        }
                        await updateParagraphCollection(itemId, language, component.id, content);
                    })
                    break;
                case "contentChunk":
                    component?.chunks && component.chunks?.forEach(async (chunk: any) => {
                        let content = {
                            type: chunk.type,
                            translation: chunk.translation,
                            id: chunk.id
                        }
                        await updateContentChunk(itemId, language, component.id, content);
                    })
                    break;
                default:
                    break;
            }
        })
        return json({
            success: true,
        });
    } catch (e) {
        return json({
            success: false,
            error: e
        })
    }
}