import { useState } from "react";
import { componentType } from "../helpers";
import { CopyButton } from "~/components/copy-button";
import { IconButton, Icon, Tooltip } from "@crystallize/design-system";
import TextareaAutosize from "react-textarea-autosize";

const ParagraphCollection = ({
  data,
  item,
}: {
  data: any;
  item: { id: string; language: string };
}) => {
  const [paragraphData, setParagraphData] = useState<any>(data);

  const handleClick = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      paragraphData.paragraphs.map(async (paragraph: any) => {
        const body = {
          id: item.id,
          language: item.language,
          componentId: paragraphData.id,
          content: {
            title: { text: paragraph.title },
            body: { html: paragraph.body },
            images: paragraph.images.map((image: any) => {
              return { key: image.key };
            }),
          },
          type: "paragraphCollection",
        };

        await fetch("/api/update", {
          method: "POST",
          body: JSON.stringify(body),
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form>
      <div className="mb-3 flex flex-col gap-2 w-full">
        <div className="flex  items-center gap-2 justify-between pr-4">
          <div className="flex capitalize font-medium text-sm gap-2 ">
            {componentType["paragraphCollection"]}
            <p>{data.id}</p>
          </div>
          <Tooltip content="Add paragraph collection translation to draft">
            <IconButton variant="elevate" onClick={handleClick}>
              <Icon.Rocket width="24" height="24" />
            </IconButton>
          </Tooltip>
        </div>
        <div className="mt-2">
          {paragraphData?.paragraphs?.map((el: any, innerIndex: number) => {
            return (
              <div
                key={innerIndex}
                className="w-full bg-[#fff] rounded-md shadow overflow-hidden mb-4 "
              >
                <div className="relative flex justify-between items-center">
                  <input
                    value={el?.title}
                    placeholder="Paragraph Collection title"
                    className="w-full text-lg font-medium px-6 pt-6 pb-2 placeholder:font-normal placeholder:text-base placeholder:italic focus:outline-purple-200"
                    onChange={(e) => {
                      const newParagraphData = { ...paragraphData };
                      newParagraphData.paragraphs[innerIndex].title =
                        e.target.value;
                      setParagraphData(newParagraphData);
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
                    onChange={(e) => {
                      const newParagraphData = { ...paragraphData };
                      newParagraphData.paragraphs[innerIndex].body =
                        e.target.value;
                      setParagraphData(newParagraphData);
                    }}
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
      </div>
    </form>
  );
};

export default ParagraphCollection;
