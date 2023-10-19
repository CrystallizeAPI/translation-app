import { Button, Icon } from "@crystallize/design-system";
import Dropdown from "./dropdown";

type TranslateLanguage = {
  from: string;
  to: string;
};

type TranslationToolbarProps = {
  availableLanguages: { code: string; name: string }[];
  translateLanguage: TranslateLanguage;
  onChangeLanguage: (translationLanguage: TranslateLanguage) => void;
  onTranslate: (e: React.FormEvent) => Promise<void>;
};

export function TranslationToolbar({
  translateLanguage,
  availableLanguages,
  onChangeLanguage,
  onTranslate,
}: TranslationToolbarProps) {
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
          <label className="text-xs whitespace-nowrap flex items-center gap-2">
            <input type="checkbox" />
            Add all translations to {translateLanguage.to} draft
          </label>
          <label className="text-xs flex items-center gap-2">
            <input type="checkbox" />
            Include all variants
          </label>
        </div>

        <Button
          intent="action"
          onClick={onTranslate}
          prepend={<Icon.Language width={20} height={20} />}
          disabled={translateLanguage.to ? false : true}
        >
          Translate
        </Button>
      </div>
    </div>
  );
}
