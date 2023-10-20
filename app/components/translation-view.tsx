import type { Component } from "~/__generated__/types";

import { TranslationForm } from "~/components/translation-form";
import { TranslationToolbar } from "~/components/translation-toolbar";
import { TranslationProgress } from "~/components/translation-progress";
import { TranslationProperties } from "~/components/translation-properties";
import { useTranslations } from "~/use-cases/use-translations";
import { Properties } from "~/use-cases/types";

type TranslationViewProps = {
  itemId: string;
  language: string;
  components: Component[];
  availableLanguages: { code: string; name: string }[];
  variantSku?: string;
  properties: Properties;
};

export function TranslationView({
  itemId,
  language,
  components,
  properties,
  availableLanguages,
  variantSku,
}: TranslationViewProps) {
  const {
    componentsWithTranslation,
    onTranslate,
    translateLanguage,
    onChangeLanguage,
    currentProcessingTranslationsCount,
    totalProcessingTranslationsCount,
  } = useTranslations({ itemId, language, components, variantSku, properties });

  return (
    <div className="pt-4 bg-gray-50">
      <TranslationToolbar
        availableLanguages={availableLanguages}
        translateLanguage={translateLanguage}
        onChangeLanguage={onChangeLanguage}
        onTranslate={onTranslate}
      />
      <TranslationProgress
        currentProcessingTranslationsCount={currentProcessingTranslationsCount}
        totalProcessingTranslationsCount={totalProcessingTranslationsCount}
      />
      <TranslationProperties
        properties={properties}
        onPropertiesChange={() => {}}
      />
      <TranslationForm components={componentsWithTranslation} />
    </div>
  );
}
