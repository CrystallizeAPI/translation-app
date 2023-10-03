import { ActionFunction, json } from '@remix-run/node';
import { updateVariantComponentChoice } from '~/use-cases/write/update-component-choice-variant';
import { updateContentChunk } from '~/use-cases/write/update-content-chunk';
import { updateParagraphCollection } from '~/use-cases/write/update-paragraph-collection';
import { updateRichTextComponent } from '~/use-cases/write/update-rich-text-component';
import { updateVariantRichText } from '~/use-cases/write/update-rich-text-variant';
import { updateSingleLineComponent } from '~/use-cases/write/update-single-line-component';
import { updateVariantSingleLine } from '~/use-cases/write/update-single-line-variant';

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
            case "variantSingleLine":
              await updateVariantSingleLine(
                body.productId,
                body.sku,
                body.language,
                body.componentId,
                body.content || ""
              )
              case "variantRichText":
                await updateVariantRichText(
                  body.productId,
                  body.sku,
                  body.language,
                  body.componentId,
                  body.content || ""
                )
              case "variantComponentChoice":
                await updateVariantComponentChoice(
                  body.productId,
                  body.sku,
                  body.language,
                  body.componentId,
                  body.content || ""
                )
                break;
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
