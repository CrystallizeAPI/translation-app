import type { Component } from "~/__generated__/types";

export type Preferences = {
  shouldPushTranslationToDraft: boolean;
  shouldIncludeAllVariants: boolean;
  customPromptFromUser?: string;
};

export type Translation = string | { title?: string; body?: string }[];

export type ComponentsWithTranslation = Component & {
  isTranslating?: boolean;
  translation?: Translation;
};
