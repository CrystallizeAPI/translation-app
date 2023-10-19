import type { Component } from "~/__generated__/types";

import { TranslationForm } from "~/components/translation-form";
import { TranslationToolbar } from "~/components/translation-toolbar";
import { useTranslations } from "~/use-cases/use-translations";

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
  } = useTranslations({ language, components });

  return (
    <>
      <TranslationToolbar
        availableLanguages={availableLanguages}
        translateLanguage={translateLanguage}
        onChangeLanguage={onChangeLanguage}
        onTranslate={onTranslate}
      />
      <TranslationForm components={componentsWithTranslation} />
    </>
  );
}
