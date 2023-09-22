import { useState } from "react";
import { componentType } from "../helpers";
import { CopyButton } from "~/components/copy-button";
import TextareaAutosize from "react-textarea-autosize";
import { IconButton, Icon, Tooltip } from "@crystallize/design-system";

const ContentChunk = ({
  data,
  item,
}: {
  data: any;
  item: { id: string; language: string };
}) => {
  function groupAndTransformArray(arr: any[]) {
    const groupedData: any = {};

    for (const i of arr) {
      const id = i.id;
      const compInfo = i.type.split(/(\d+)/);
      const type = compInfo[1];
      const cId = compInfo[2];
      const translation = i.translation;

      if (!groupedData[id]) {
        groupedData[id] = [];
      }

      let existingItem = groupedData[id].find(
        (el: any) => el.type === compInfo
      );

      if (!existingItem) {
        existingItem = {
          type: i.type,
        };
        groupedData[id].push(existingItem);
      }

      switch (i.type) {
        case `contentChunkText${type}${cId}`:
          existingItem.singleLine = translation;
          existingItem.id = cId;
          break;
        case `contentChunkPlainText${type}${cId}`:
          existingItem.richText = translation;
          existingItem.id = cId;
          break;
        case `contentChunkImages${type}${cId}`:
          existingItem.images.push(translation);
          existingItem.id = cId;
          break;
        default:
          break;
      }
    }

    const result = Object.keys(groupedData).map((id) => ({
      [id]: groupedData[id],
    }));
    return result;
  }

  const resultArray = groupAndTransformArray(data);

  const [chunkData, setChunkData] = useState<any>(resultArray);

  const handleClick = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    chunkData?.map(async (chunk: any) => {
      const key = Object.keys(chunk)[0];
      const values = chunk[key];
      values.map(async (el: any) => {
        const body = {
          id: item.id,
          language: item.language,
          componentId: key,
          type: "contentChunk",
          content: el,
        };
        await fetch("/api/update", {
          method: "POST",
          body: JSON.stringify(body),
        });
      });
    });
  };

  return (
    <form>
      <div className="mb-3 flex flex-col w-full bg-s-purple-100 pl-4 rounded-md">
        {chunkData &&
          chunkData.map((item: any, index: number) => {
            const key = Object.keys(item)[0];
            const values = item[key];
            return (
              <div key={index} className="">
                <div className="flex  items-center gap-2 justify-between pt-3 pb-2 pr-4">
                  <div className="flex capitalize font-medium text-sm gap-2">
                    {componentType["contentChunk"]}
                    <p>{key}</p>
                  </div>
                  <Tooltip content="Add this translation to draft">
                    <IconButton variant="elevate" onClick={handleClick}>
                      <Icon.Rocket width="24" height="24" />
                    </IconButton>
                  </Tooltip>
                </div>

                <div className="w-full flex flex-col">
                  {values.map((value: any, innerIndex: any) => (
                    <div key={innerIndex}>
                      {value?.singleLine && (
                        <div className="w-full flex relative overflow-hidden bg-[#fff] border-0 border-b border-solid border-gray-100">
                          <input
                            value={value?.singleLine}
                            className="bg-white px-6 py-4   text-base font-medium w-full focus:outline-purple-200 pr-8"
                            onChange={(e) => {
                              const newChunkData = [...chunkData];
                              newChunkData[index][key][innerIndex].singleLine =
                                e.target.value;
                              setChunkData(newChunkData);
                            }}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <CopyButton text={value?.singleLine} />
                          </div>
                        </div>
                      )}
                      {value?.richText && (
                        <div className="w-full relative bg-[#fff]">
                          <TextareaAutosize
                            value={value?.richText}
                            className="bg-white px-6 py-4 text-base w-full min-h-[140px] focus:outline-purple-200 pr-8"
                            onChange={(e) => {
                              const newChunkData = [...chunkData];
                              newChunkData[index][key][innerIndex].richText =
                                e.target.value;
                              setChunkData(newChunkData);
                            }}
                          />
                          <div className="absolute right-4 top-3 ">
                            <CopyButton text={value?.richText} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </form>
  );
};

export default ContentChunk;
