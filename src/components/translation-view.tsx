import type { Component, ItemType } from "~/__generated__/types";

import { TranslationForm } from "~/components/translation-form";
import { TranslationToolbar } from "~/components/translation-toolbar";
import { TranslationProgress } from "~/components/translation-progress";
import { TranslationProperties } from "~/components/translation-properties";
import { useTranslations } from "~/core/use-translations";
import type { Property } from "~/use-cases/contracts/types";
import type { SerializeFrom } from "@remix-run/node";

type TranslationViewProps = {
    itemId: string;
    itemType: ItemType;
    language: string;
    availableLanguages: { code: string; name: string }[];
    variantSku?: string | null;
    properties: SerializeFrom<Property[] | null>;
    components?: SerializeFrom<Component[] | null>;
};

export function TranslationView({
    itemId,
    itemType,
    language,
    components,
    properties,
    availableLanguages,
    variantSku,
}: TranslationViewProps) {
    const {
        componentWithTranslation,
        propertiesWithTranslation,
        onTranslate,
        translateLanguage,
        onChangeLanguage,
        currentProcessingTranslationsCount,
        totalProcessingTranslationsCount,
    } = useTranslations({
        itemId,
        itemType,
        language,
        components,
        variantSku,
        properties,
    });

    return (
        <div className="pt-4 bg-gray-50">
            <TranslationToolbar
                availableLanguages={availableLanguages}
                translateLanguage={translateLanguage}
                onChangeLanguage={onChangeLanguage}
                onTranslate={onTranslate}
            />
            <TranslationProgress
                currentProcessingTranslationsCount={
                    currentProcessingTranslationsCount
                }
                totalProcessingTranslationsCount={
                    totalProcessingTranslationsCount
                }
            />
            <TranslationProperties properties={propertiesWithTranslation} />
            <TranslationForm components={componentWithTranslation} />
        </div>
    );
}
