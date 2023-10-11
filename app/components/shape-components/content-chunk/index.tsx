import { componentType } from "../helpers";
import { CopyButton } from "~/components/copy-button";
import TextareaAutosize from "react-textarea-autosize";
import { IconButton, Icon, Tooltip } from "@crystallize/design-system";

const ContentChunk = ({
  data,
  item,
  setEditedTranslation,
}: {
  data: any;
  item: { id: string; language: string };
  setEditedTranslation: any;
}) => {
  // const handleClick = async (e: any) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   data?.chunks?.map(async (chunk: any) => {
  //     const body = {
  //       id: item.id,
  //       language: item.language,
  //       componentId: data.id,
  //       content: chunk,
  //       type: "contentChunk",
  //     };
  //     await fetch("/api/update", {
  //       method: "POST",
  //       body: JSON.stringify(body),
  //     });
  //   });
  // };

  // const onChange = (e: any, index: number, type: string) => {
  //   const newParagraphData = { ...data };
  //   newParagraphData.chunks[index].translation = e.target.value;
  //   setEditedTranslation((prev: any) => {
  //     return prev.map((i: any) => (i.id === data.id ? newParagraphData : i));
  //   });
  // };
  console.log({ data });
  return (
    <form>
      <div className="mb-3 flex flex-col w-full bg-s-purple-100 pl-4 rounded-md">
        <div>Heisann</div>
        {data?.chunks &&
          data?.chunks?.map((chunk: any, index: number) => {
            return (
              <div key={index}>
                <div className="flex  items-center gap-2 justify-between pt-3 pb-2 pr-4">
                  <div className="flex capitalize font-medium text-sm gap-2">
                    {componentType["contentChunk"]}
                    <p>{data?.id}</p>
                  </div>
                  {/* <Tooltip content="Add this translation to draft">
                    <IconButton variant="elevate" onClick={handleClick}>
                      <Icon.Rocket width="24" height="24" />
                    </IconButton>
                  </Tooltip> */}
                </div>
                <div className="w-full flex flex-col">
                  {chunk?.type === "singleLine" && (
                    <div className="w-full flex relative overflow-hidden bg-[#fff] border-0 border-b border-solid border-gray-100">
                      <input
                        value={chunk?.translation}
                        className="bg-white px-6 py-4   text-base font-medium w-full focus:outline-purple-200 pr-8"
                        onChange={(e) => onChange(e, index, "")}
                      />
                      {/* <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <CopyButton text={chunk?.content?.text} />
                      </div> */}
                    </div>
                  )}
                  {chunk?.type === "richText" && (
                    <div className="w-full relative bg-[#fff]">
                      <TextareaAutosize
                        value={chunk?.content?.plainText}
                        className="bg-white px-6 py-4 text-base w-full min-h-[140px] focus:outline-purple-200 pr-8"
                        onChange={(e) => {}}
                      />
                      {/* <div className="absolute right-4 top-3 ">
                        <CopyButton text={chunk?.content?.plainText} />
                      </div> */}
                    </div>
                  )}
                  {chunk?.type === "paragraphCollection" && (
                    <div className="w-full relative bg-[#fff]">
                      paragraph collection
                      {/* <TextareaAutosize
                        value={chunk?.content?.plainText}
                        className="bg-white px-6 py-4 text-base w-full min-h-[140px] focus:outline-purple-200 pr-8"
                        onChange={(e) => {}}
                      />
                      <div className="absolute right-4 top-3 ">
                        <CopyButton text={chunk?.content?.plainText} />
                      </div> */}
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
                </div>
              </div>
            );
          })}
      </div>
    </form>
  );
};

export default ContentChunk;
