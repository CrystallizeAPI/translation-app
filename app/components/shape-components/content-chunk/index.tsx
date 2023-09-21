import { useState } from "react";
import { componentType } from "../helpers";
import { CopyButton } from "~/components/copy-button";

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
      <div className="mb-3 flex flex-col gap-2 w-full">
        {chunkData &&
          chunkData.map((item: any, index: number) => {
            const key = Object.keys(item)[0];
            const values = item[key];
            return (
              <div
                key={index}
                className="grid grid-cols-[160px_1fr] items-start"
              >
                <div className="flex capitalize font-medium text-sm gap-2">
                  {componentType["contentChunk"]}
                  <p>{key}</p>
                </div>
                <div className="w-full">
                  {values.map((value: any, innerIndex: any) => (
                    <div key={innerIndex}>
                      {value?.singleLine && (
                        <div className="w-full relative">
                          <input
                            value={value?.singleLine}
                            className="bg-gray-50 w-full p-2"
                            onChange={(e) => {
                              const newChunkData = [...chunkData];
                              newChunkData[index][key][innerIndex].singleLine =
                                e.target.value;
                              setChunkData(newChunkData);
                            }}
                          />
                          <div className="absolute right-1 top-2">
                            <CopyButton text={value?.singleLine} />
                          </div>
                        </div>
                      )}
                      {value?.richText && (
                        <div className="w-full relative">
                          <textarea
                            value={value?.richText}
                            className="bg-gray-50 w-full p-2 h-[200px]"
                            onChange={(e) => {
                              const newChunkData = [...chunkData];
                              newChunkData[index][key][innerIndex].richText =
                                e.target.value;
                              setChunkData(newChunkData);
                            }}
                          />

                          <div className="absolute right-1 top-2">
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
        <button
          className="w-[250px] self-end bg-cyan-300 p-2 text-sm h-50 mt-2"
          onClick={handleClick}
        >
          Use this translation
        </button>
      </div>
    </form>
  );
};

export default ContentChunk;
