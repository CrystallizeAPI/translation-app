import { Translator } from "~/core/translator.server";
import { Language, Preferences } from "../contracts/types";

type Deps = {
    translator: Translator;
};

export const translateSingleLine = async (
    component: any,
    translateLanguage: Language,
    preferences: Preferences,
    { translator }: Deps
) => {
    const translation = component?.content?.text && await translator.translate({
        text: component.content.text,
        language: translateLanguage,
        preferences
    });
    return {
        id: component.id,
        type: "singleLine",
        translation: translation || "",
    };
};
