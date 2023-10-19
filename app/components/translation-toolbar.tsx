import { Button, Icon, Label, Checkbox } from "@crystallize/design-system";
import { useState } from "react";
import Dropdown from "./dropdown";
import type { Preferences } from "../use-cases/types";

type TranslateLanguage = {
  from: string;
  to: string;
};

type TranslationToolbarProps = {
  availableLanguages: { code: string; name: string }[];
  translateLanguage: TranslateLanguage;
  onChangeLanguage: (translationLanguage: TranslateLanguage) => void;
  onTranslate: ({
    shouldPushTranslationToDraft,
    shouldIncludeAllVariants,
  }: Preferences) => void;
};

export function TranslationToolbar({
  translateLanguage,
  availableLanguages,
  onChangeLanguage,
  onTranslate,
}: TranslationToolbarProps) {
  const [preferences, setPreferences] = useState({
    shouldPushTranslationToDraft: false,
    shouldIncludeAllVariants: false,
  });

  return (
    <div className="flex py-8 flex-row justify-between border-solid  border-0 border-b border-gray-200">
      <div className="flex flex-row gap-2 items-center  w-full ">
        <div>
          <Dropdown
            options={availableLanguages}
            selectedOption={translateLanguage.from}
            onSelectOption={(code) =>
              onChangeLanguage({ ...translateLanguage, from: code })
            }
            buttonText="Select language"
          />
        </div>
        <span>to </span>
        <div className="flex items-center gap-4">
          <Dropdown
            options={availableLanguages}
            selectedOption={translateLanguage.to}
            buttonText="Select language"
            onSelectOption={(code) =>
              onChangeLanguage({ ...translateLanguage, to: code })
            }
          />
        </div>
      </div>
      <div className="flex gap-8">
        <div className="flex flex-col gap-2">
          <Label className="text-xs whitespace-nowrap flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={preferences.shouldPushTranslationToDraft}
              onCheckedChange={(value: boolean) =>
                setPreferences((prev) => ({
                  ...prev,
                  shouldPushTranslationToDraft: value,
                }))
              }
            />
            Add all translations to {translateLanguage.to} draft
          </Label>
          <Label className="text-xs flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={preferences.shouldIncludeAllVariants}
              onCheckedChange={(value: boolean) =>
                setPreferences((prev) => ({
                  ...prev,
                  shouldIncludeAllVariants: value,
                }))
              }
            />
            Include all variants
          </Label>
        </div>

        <Button
          intent="action"
          onClick={() => onTranslate(preferences)}
          prepend={<Icon.Language width={20} height={20} />}
          disabled={translateLanguage.to ? false : true}
        >
          Translate
        </Button>
      </div>
    </div>
  );
}
