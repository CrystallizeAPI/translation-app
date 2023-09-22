import { CopyButton } from "~/components/copy-button";
import { componentType } from "../helpers";
import { useState } from "react";
import { IconButton, Icon, Tooltip } from "@crystallize/design-system";
const SingleLine = ({
  data,
  item,
}: {
  data: any;
  item: {
    id: string;
    language: string;
  };
}) => {
  const [translation, setTranslation] = useState<any>(data.translation);

  const handleClick = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await fetch("/api/update", {
        method: "POST",
        body: JSON.stringify({
          id: item.id,
          language: item.language,
          componentId: data.id,
          content: translation,
          type: "singleLine",
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="items-start">
      <div className="flex  items-center gap-2 justify-between pr-4">
        <div className="flex capitalize items-center  font-medium text-sm gap-2">
          {componentType["singleLine"]}
          {data?.id}
        </div>
        <div>
          <div className="flex flex-row gap-2 w-full justify-end mt-2">
            <Tooltip content="Add this translation to draft">
              <IconButton variant="elevate" onClick={handleClick}>
                <Icon.Rocket width="24" height="24" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
      <form className="gap-2 pt-2 relative">
        <input
          value={translation}
          className="bg-white px-6 py-4 rounded-md shadow text-base font-medium w-full focus:outline-purple-200"
          onChange={(e) => setTranslation(e.target.value)}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 ">
          <CopyButton text={translation} />
        </div>
      </form>
    </div>
  );
};

export default SingleLine;
