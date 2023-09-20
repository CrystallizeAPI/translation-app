import { ActionFunction, json } from '@remix-run/node';
import { updateContentChunk } from '~/use-cases/write/update-content-chunk';
import { updateParagraphCollection } from '~/use-cases/write/update-paragraph-collection';
import { updateRichTextComponent } from '~/use-cases/write/update-rich-text-component';
import { updateSingleLineComponent } from '~/use-cases/write/update-single-line-component';

export const action: ActionFunction = async ({ request }) => {
    const body = await request.json();
    try {
        switch (body.type) {
            case "singleLine":
                await updateSingleLineComponent(
                    body.id,
                    body.language,
                    body.componentId,
                    body.content || ""
                )
            case "richText":
                await updateRichTextComponent(
                    body.id,
                    body.language,
                    body.componentId,
                    body.content || ""
                )
            case "paragraphCollection":
                await updateParagraphCollection(
                    body.id,
                    body.language,
                    body.componentId,
                    body.content || []
                )
            case "contentChunk":
                await updateContentChunk(
                    body.id,
                    body.language,
                    body.componentId,
                    body.content || []
                )
            default:
                break;
        }
    }
    catch (e) {
        console.log("error", e);
    }

    return json({
        success: true,
    });
};
