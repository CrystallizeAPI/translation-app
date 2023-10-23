import { Translator } from "~/core/translator.server";
import { Language, Preferences } from "../contracts/types";

type Deps = {
    translator: Translator;
};

export const translateRichText = async (
    component: any,
    translateLanguage: Language,
    preferences: Preferences,
    { translator }: Deps
) => {
    if (!component?.content?.plainText) {
        return {
            id: component.id,
            type: "richText",
            translation: null,
        };
    }
    const translation = await translator.translate({
        text: component?.content?.plainText.toString() ?? "",
        language: translateLanguage,
        preferences
    })
    return {
        id: component.id,
        type: "richText",
        translation: [translation],
    };
};
