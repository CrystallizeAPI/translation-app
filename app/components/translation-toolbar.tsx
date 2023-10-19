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
    customPromptFromUser,
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
    customPromptFromUser: "",
  });

  return (
    <div className="border-solid bg-[#fff] shadow-md rounded-md overflow-hidden">
      <div className="border-0 border-b border-gray-100 flex justify-between items-center pr-6">
        <input
          value={preferences.customPromptFromUser}
          className="pl-6 py-4 pt-6 w-full placeholder:italic outline-none focus:bg-purple-50"
          placeholder="Add your own twist, i.e speak like a pirate (optional)."
          onChange={(e) =>
            setPreferences((prev) => ({
              ...prev,
              customPromptFromUser: e.target.value,
            }))
          }
        />
        <div className="flex gap-8 pl-6">
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
      <div className="flex flex-row px-6 py-2">
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
        <div className="flex flex-row gap-8">
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
          <Label className="text-xs  whitespace-nowrap  flex items-center gap-2 cursor-pointer">
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
      </div>
    </div>
  );
}
