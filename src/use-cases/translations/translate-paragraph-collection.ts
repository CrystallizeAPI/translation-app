
import { Translator } from "~/core/translator.server";
import { Language, Preferences } from "../contracts/types";

type Deps = {
    translator: Translator;
};

export const translateParagraphCollection = async (
    component: any,
    translateLanguage: Language,
    preferences: Preferences,
    { translator }: Deps
) => {
    return {
        id: component.id,
        type: "paragraphCollection",
        translation: await Promise.all(
            component?.content?.paragraphs.map(async (paragraph: any) => {
                const [title, body] = await Promise.all([
                    paragraph?.title
                        ? translator.translate({
                            text: paragraph?.title?.text ?? "",
                            language: translateLanguage,
                            preferences
                        })
                        : null,
                    paragraph?.body
                        ? translator.translate({
                            text: paragraph.body.plainText.toString(),
                            language: translateLanguage,
                            preferences
                        })
                        : null,
                ]);

                return {
                    title: { text: title },
                    body: { plainText: [body] },
                    images: paragraph?.images,
                };
            })
        ),
    };
};
