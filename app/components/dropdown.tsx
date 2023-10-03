import { Button, DropdownMenu, Icon } from "@crystallize/design-system";

function Dropdown({
  options,
  selectedOption,
  onSelectOption,
  buttonText,
}: {
  options: any[];
  selectedOption: string;
  onSelectOption: (code: string) => void;
  buttonText: string;
}) {
  return (
    <div>
      <DropdownMenu.Root
        content={
          <div className="shadow bg-[#fff] w-[150px] rounded-md py-1 flex flex-col">
            {options.map((option) => {
              if (option.code === selectedOption) return null;
              return (
                <span
                  onClick={() => onSelectOption(option.code)}
                  key={option.code}
                  className="font-medium px-2 py-1 text-sm text-center cursor-pointer hover-bg-purple-50"
                >
                  {option.name} ({option.code})
                </span>
              );
            })}
          </div>
        }
      >
        <Button variant="elevate" append={<Icon.Arrow />}>
          <span className="min-w-[100px]">
            {selectedOption ?? (
              <span className="italic font-normal mx-2">{buttonText}</span>
            )}
          </span>
        </Button>
      </DropdownMenu.Root>
    </div>
  );
}

export default Dropdown;
