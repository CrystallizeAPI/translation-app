import { componentType } from "../helpers";
import { CopyButton } from "~/components/copy-button";
import TextareaAutosize from "react-textarea-autosize";
import { IconButton, Icon, Tooltip } from "@crystallize/design-system";

const ContentChunk = ({
  data,
  item,
  setEditedTranslation,
  isOnVariant,
}: {
  data: any;
  item: { id: string; language: string; sku?: string; productId?: string };
  setEditedTranslation: React.Dispatch<React.SetStateAction<any[]>>;
  isOnVariant?: boolean;
}) => {
  const handleClick = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const body = {
      id: item.id,
      language: item.language,
      componentId: data.id,
      content: data.chunks,
      type: isOnVariant ? "variantContentChunk" : "contentChunk",
      sku: item?.sku,
      productId: item?.productId,
    };
    await fetch("/api/update", {
      method: "POST",
      body: JSON.stringify(body),
    });
  };

  const onChange = (
    e: any,
    index: number,
    type?: string,
    innerIndex?: number
  ) => {
    const newChunkData = { ...data };
    switch (type) {
      case "title":
        newChunkData.chunks[index].paragraphs[innerIndex!].title =
          e.target.value;
        break;
      case "body":
        newChunkData.chunks[index].paragraphs[innerIndex!].body =
          e.target.value;
        break;
      default:
        newChunkData.chunks[index].translation = e.target.value;
        break;
    }
    setEditedTranslation((prev: any) => {
      return prev.map((i: any) => (i.id === data.id ? newChunkData : i));
    });
  };

  const onVariantChange = (
    e: any,
    index: number,
    type?: string,
    innerIndex?: number
  ) => {
    setEditedTranslation((prev: any) => {
      return prev.map((i: any) => {
        const newItem = { ...i };
        if (i?.id === item?.id) {
          newItem.components = newItem.components.map((component: any) => {
            if (component?.id === data?.id) {
              const newChunkData = { ...component };
              switch (type) {
                case "title":
                  newChunkData.chunks[index].paragraphs[innerIndex!].title =
                    e.target.value;
                  break;
                case "body":
                  newChunkData.chunks[index].paragraphs[innerIndex!].body =
                    e.target.value;
                  break;
                default:
                  newChunkData.chunks[index].translation = e.target.value;
                  break;
              }
              return newChunkData;
            }
            return component;
          });
        }
        return newItem;
      });
    });
  };
  return (
    <div className="mb-3 flex flex-col w-full bg-s-purple-100 pl-4 rounded-md">
      {data?.chunks && data.chunks.length > 0 && (
        <div className="mb-3 flex  w-full pl-4 rounded-md py-2 tems-center gap-2 justify-between pt-3 pb-2 pr-4">
          <div className="flex capitalize font-medium text-sm gap-2">
            {componentType["contentChunk"]}
            <p>{data?.id}</p>
          </div>
          <Tooltip content="Add this translation to draft">
            <IconButton variant="elevate" onClick={handleClick}>
              <Icon.Rocket width="24" height="24" />
            </IconButton>
          </Tooltip>
        </div>
      )}
      {data?.chunks &&
        data?.chunks?.map((chunk: any, index: number) => {
          return (
            <div key={index}>
              <div className="flex capitalize font-medium text-sm gap-2 px-3 py-4">
                {
                  //@ts-expect-error
                  componentType[chunk?.type]
                }
                <p>{chunk.id}</p>
              </div>
              {chunk?.type === "singleLine" && (
                <div className="w-full flex relative overflow-hidden bg-[#fff] border-0 border-b border-solid border-gray-100 py-2">
                  <input
                    value={chunk?.translation}
                    className="bg-white px-6 py-4   text-base font-medium w-full focus:outline-purple-200 pr-8"
                    onChange={(e) =>
                      isOnVariant
                        ? onVariantChange(e, index)
                        : onChange(e, index)
                    }
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <CopyButton text={chunk?.content?.text} />
                  </div>
                </div>
              )}
              {chunk?.type === "richText" && (
                <div className="w-full relative bg-[#fff] py-2">
                  <TextareaAutosize
                    value={chunk?.translation}
                    className="bg-white px-6 py-4 text-base w-full min-h-[140px] focus:outline-purple-200 pr-8"
                    onChange={(e) => {
                      isOnVariant
                        ? onVariantChange(e, index)
                        : onChange(e, index);
                    }}
                  />
                  <div className="absolute right-4 top-3 ">
                    <CopyButton text={chunk?.translation} />
                  </div>
                </div>
              )}
              {chunk?.type === "images" &&
                chunk?.content?.images?.map((image: any, index: number) => {
                  return (
                    <div
                      className="w-32 rounded overflow-hidden shadow"
                      key={index}
                    >
                      <img src={image?.url} className="w-full" />
                    </div>
                  );
                })}
              {chunk?.type === "paragraphCollection" &&
                chunk?.paragraphs?.map((el: any, innerIndex: number) => {
                  return (
                    <div
                      key={innerIndex}
                      className="w-full bg-[#fff] rounded-md shadow overflow-hidden mb-4 py-2"
                    >
                      <div className="relative flex justify-between items-center">
                        <input
                          value={el?.title}
                          placeholder="Paragraph Collection title"
                          className="w-full text-lg font-medium px-6 pt-6 pb-2 placeholder:font-normal placeholder:text-base placeholder:italic focus:outline-purple-200"
                          onChange={(e) => {
                            isOnVariant
                              ? onVariantChange(e, index, "title", innerIndex)
                              : onChange(e, index, "title", innerIndex);
                          }}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 ">
                          <CopyButton text={el?.title} variant="default" />
                        </div>
                      </div>
                      <div className="w-full relative flex">
                        <TextareaAutosize
                          value={el?.body}
                          placeholder="Paragraph collection body"
                          className="bg-white pl-6 py-2 pr-12 min-h-[140px]  text-base w-full focus:outline-purple-200"
                          onChange={(e) =>
                            isOnVariant
                              ? onVariantChange(e, index, "body", innerIndex)
                              : onChange(e, index, "body", innerIndex)
                          }
                        />
                        <div className="absolute right-4 top-3 ">
                          <CopyButton text={el?.body} variant="default" />
                        </div>
                      </div>
                      <div className="px-6 py-6">
                        {el?.images &&
                          el?.images?.map((image: any, index: number) => (
                            <div
                              className="w-32 rounded overflow-hidden shadow"
                              key={index}
                            >
                              <img src={image?.url} className="w-full " />
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        })}
    </div>
  );
};

export default ContentChunk;
