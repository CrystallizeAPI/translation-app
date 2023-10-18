import { SingleLine, RichText, ParagraphCollection } from "../index";
import { CopyButton } from "~/components/copy-button";
import { componentType } from "../helpers";
import { IconButton, Icon, Tooltip } from "@crystallize/design-system";

export default function ComponentFactory({
  component,
  isStructuralComponent,
  structuralColor,
}: {
  isStructuralComponent?: boolean;
  structuralColor?: string;
  component: {
    id: string;
    type: string;
    translation?: string;
    content?: string;
  };
}) {
  const componentTypes = {
    singleLine: (
      <SingleLine
        key={component.id}
        data={component}
        isStructuralComponent={isStructuralComponent}
        structuralColor={structuralColor}
      />
    ),
    richText: (
      <RichText
        key={component.id}
        data={component}
        isStructuralComponent={isStructuralComponent}
        structuralColor={structuralColor}
      />
    ),
    paragraphCollection: (
      <ParagraphCollection
        key={component.id}
        data={component}
        isStructuralComponent={isStructuralComponent}
        structuralColor={structuralColor}
      />
    ),
  };

  const { type, isTranslating, translation } = component;
  if (isStructuralComponent) {
    return (
      <div className="bg-[#fff] border-b border-solid border-purple-100">
        <div className="flex pl-6 pt-2 items-end gap-2 justify-between">
          <div className="flex capitalize h-7 items-center font-medium text-sm gap-2">
            {translation && (
              <div className="bg-s-green-600 rounded-full justify-center w-4 h-4 text-[10px] font-medium flex items-center text-[#fff]">
                ✓
              </div>
            )}
            <span className={`${structuralColor} italic font-normal text-xs`}>
              {component?.id}
            </span>
            {isTranslating && !translation && (
              <div className="border-gray-200 h-4 w-4 animate-spin-slow rounded-full border-[3px] border-t-s-green-600" />
            )}
          </div>
          <div>
            {translation && (
              <div className="flex flex-row gap-2 w-full justify-end">
                <CopyButton text={translation ?? ""} />
              </div>
            )}
          </div>
        </div>

        {componentTypes[type]}
      </div>
    );
  }
  return (
    <div>
      <div className="flex pl-2 pt-2 items-end gap-2 justify-between">
        <div className="flex capitalize h-7 pb-2 items-center   font-medium text-sm gap-2">
          {translation ? (
            <div className="bg-s-green-600 rounded-full justify-center w-4 h-4 text-[10px] font-medium flex items-center text-[#fff]">
              ✓
            </div>
          ) : (
            <div className="-mr-1">{componentType[type]}</div>
          )}
          <span className="font-medium text-xs">{component?.id}</span>
          {isTranslating && !translation && (
            <div className="border-gray-200 h-4 w-4 animate-spin-slow rounded-full border-[3px] border-t-s-green-600" />
          )}
        </div>
        <div>
          {translation && (
            <div className="flex flex-row gap-2 w-full justify-end">
              <CopyButton text={translation ?? ""} />
            </div>
          )}
        </div>
      </div>

      <div className="shadow bg-[#fff] overflow-hidden rounded-md ">
        {componentTypes[type]}
      </div>
    </div>
  );
}
