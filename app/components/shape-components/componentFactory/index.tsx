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
  structuralColor?: {
    text: string;
    bg: string;
  };
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
      />
    ),
    richText: (
      <RichText
        key={component.id}
        data={component}
        isStructuralComponent={isStructuralComponent}
      />
    ),
    paragraphCollection: (
      <ParagraphCollection
        key={component.id}
        data={component}
        isStructuralComponent={isStructuralComponent}
      />
    ),
  };

  const { type, isTranslating, translation } = component;
  if (isStructuralComponent) {
    return (
      <div className="group bg-[#fff] border-b border-solid border-purple-100 ">
        <div className="flex pl-6 pt-2 items-end gap-2 justify-between">
          <div className="flex capitalize h-7 items-center font-medium text-sm gap-2">
            {translation && (
              <div className="bg-s-green-600 rounded-full justify-center w-4 h-4 text-[10px] font-medium flex items-center text-[#fff]">
                ✓
              </div>
            )}
            <span
              className={`${structuralColor?.text} italic font-normal text-xs`}
            >
              {component?.id}
            </span>
            {isTranslating && !translation && (
              <div className="border-gray-200 h-4 w-4 animate-spin-slow rounded-full border-[3px] border-t-s-green-600" />
            )}
          </div>
        </div>

        <div className="relative">
          {componentTypes[type]}
          {translation && (
            <div className="group-hover:block hidden absolute top-2 p-0.5 rounded-md bg-purple-50 right-2">
              <div className="flex flex-row gap-2 w-full justify-end">
                <CopyButton text={translation ?? ""} />
                <Tooltip content="Add this translation to draft">
                  <IconButton className="!w-7 !h-7">
                    <Icon.Rocket width="20" height="20" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="group">
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
      </div>

      <div className=" relative shadow bg-[#fff] overflow-hidden rounded-md ">
        {componentTypes[type]}
        {translation && (
          <div className="group-hover:block hidden absolute top-2 p-0.5 rounded-md bg-purple-50 right-2">
            <div className="flex flex-row gap-2 w-full justify-end">
              <CopyButton text={translation ?? ""} />
              <Tooltip content="Add this translation to draft">
                <IconButton className="!w-7 !h-7">
                  <Icon.Rocket width="20" height="20" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
