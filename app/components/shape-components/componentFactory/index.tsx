import {
  SingleLine,
  RichText,
  ParagraphCollection,
  ContentChunk,
  ComponentChoice,
} from "../index";
import { CopyButton } from "~/components/copy-button";
import { componentType } from "../helpers";
import { IconButton, Icon, Tooltip } from "@crystallize/design-system";

export default function ComponentFactory({ component }) {
  const componentTypes = {
    singleLine: <SingleLine key={component.id} data={component} />,
    richText: <RichText key={component.id} data={component} />,
    paragraphCollection: (
      <ParagraphCollection key={component.id} data={component} />
    ),
    // contentChunk: <ContentChunk key={cmp.id} data={cmp} />,
    // componentChoice: (
    //   <ComponentChoice
    //     key={cmp.id}
    //     // data={i}
    //     // item={itemData}
    //     // setEditedTranslation={setSingleLineTranslations}
    //   />
    // ),
  };

  const { type, isTranslating, translation } = component;
  const structuralCmpTypes = ["contentChunk", "componentChoice"];
  const isStructuralComponent = structuralCmpTypes.includes(type);

  if (isStructuralComponent) {
    return componentTypes[type];
  }
  return (
    <div
      className={`${isStructuralComponent ? "bg-purple-100 rounded-t-md" : ""}`}
    >
      <div className="flex pl-2 pt-2 items-end gap-2 justify-between mt-4">
        <div className="flex capitalize h-7 items-center   font-medium text-sm gap-2">
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
              <Tooltip content="Add this translation to draft">
                <IconButton className="!w-7 !h-7">
                  <Icon.Rocket width="20" height="20" />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
      </div>

      <div className="pt-2">{componentTypes[type]}</div>
    </div>
  );
}
