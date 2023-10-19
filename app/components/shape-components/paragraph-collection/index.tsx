import { CopyButton } from "~/components/copy-button";
import TextareaAutosize from "react-textarea-autosize";
import type { ComponentsWithTranslation } from "~/use-cases/types";
import type { ParagraphCollectionContent } from "~/__generated__/types";

export const ParagraphCollection = ({
  data,
}: {
  data: ComponentsWithTranslation;
}) => {
  const paragraphs =
    (data.content as ParagraphCollectionContent)?.paragraphs ?? [];
  const hasTranslation = data.translationState === "translated";

  return (
    <form className="flex flex-col gap-4">
      {paragraphs?.map((el: any, innerIndex: number) => {
        return (
          <div key={innerIndex}>
            <div className="relative flex justify-between items-center">
              <input
                value={hasTranslation ? el?.title : el?.title?.text}
                placeholder="Paragraph Collection title"
                className={`!bg-[#fff] w-full pt-3  text-lg font-medium px-6  placeholder:font-normal placeholder:text-base placeholder:italic focus:outline-none
                ${
                  !hasTranslation
                    ? "text-base font-normal text-gray-400 italic"
                    : "text-base font-medium"
                }`}
                readOnly
              />

              {hasTranslation && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 ">
                  <CopyButton text={el?.title} variant="default" />
                </div>
              )}
            </div>
            <div className="w-full relative flex">
              <TextareaAutosize
                value={
                  hasTranslation ? el?.body : el.body?.plainText?.map((a) => a)
                }
                placeholder="Paragraph collection body"
                className={`!bg-[#fff] px-6 py-4 min-h-[140px]  w-full focus:outline-none ${
                  !hasTranslation
                    ? "text-base font-normal text-gray-400 italic "
                    : "text-base font-normal  "
                }`}
                readOnly
              />
              {hasTranslation && (
                <div className="absolute right-4 top-3 ">
                  <CopyButton text={el?.body} variant="default" />
                </div>
              )}
            </div>
            {el?.images && (
              <div className="px-6 py-6 flex gap-2">
                {el?.images?.map((image: any, index: number) => (
                  <div
                    className="w-32 rounded overflow-hidden p-2 bg-[#fff] shadow"
                    key={index}
                  >
                    <img src={image?.url} className="w-full" alt="Item" />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </form>
  );
};
