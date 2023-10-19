import type { Component } from "~/__generated__/types";

import { TranslationForm } from "~/components/translation-form";
import { TranslationToolbar } from "~/components/translation-toolbar";
import { useTranslations } from "~/use-cases/use-translations";
import { TranslationProgress } from "~/components/translation-progress";

type TranslationViewProps = {
  language: string;
  components: Component[];
  availableLanguages: { code: string; name: string }[];
};

export function TranslationView({
  language,
  components,
  availableLanguages,
}: TranslationViewProps) {
  const {
    componentsWithTranslation,
    onTranslate,
    translateLanguage,
    onChangeLanguage,
    currentProcessingTranslationsCount,
    totalProcessingTranslationsCount,
  } = useTranslations({ language, components });

  return (
    <div className="pt-4">
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
      <TranslationForm components={componentsWithTranslation} />
    </div>
  );
}
