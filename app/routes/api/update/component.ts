import { ActionFunction } from "@remix-run/node";
import type { Component } from "~/__generated__/types";
import { json } from "remix-utils";
import { toComponentInput } from "~/use-cases/to-component-input";
import { updateItemComponent, updateVariantComponent } from "~/use-cases/write";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();

  const { itemId, language, component, variantSku } = body;

  try {
    const input = toComponentInput(component as Component);

    if (variantSku) {
      await updateVariantComponent({
        input,
        language,
        sku: variantSku,
        productId: itemId,
      });
    } else {
      await updateItemComponent({ itemId, language, input });
    }

    return json({ success: true });
  } catch (e) {
    return json({ success: false, error: e });
  }
};
