import { ActionFunction } from "@remix-run/node";
import type { Component } from "~/__generated__/types";
import { json } from "remix-utils";
import { toComponentInput } from "~/use-cases/to-component-input";
import { updateItemComponent } from "~/use-cases/write/update-item-component";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json();

  const { itemId, language, component } = body;

  try {
    const input = toComponentInput(component as Component);
    await updateItemComponent({ itemId, language, input });

    return json({ success: true });
  } catch (e) {
    return json({ success: false, error: e });
  }
};
