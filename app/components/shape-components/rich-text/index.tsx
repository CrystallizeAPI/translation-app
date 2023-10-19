import TextareaAutosize from "react-textarea-autosize";
import type { ComponentsWithTranslation } from "~/use-cases/types";
import type { RichTextContent } from "~/__generated__/types";

export const RichText = ({ data }: { data: ComponentsWithTranslation }) => {
  const hasTranslation = data.translationState === "translated";

  return (
    <TextareaAutosize
      value={(data?.content as RichTextContent)?.plainText?.map((a) => a) ?? ""}
      className={`${
        !hasTranslation
          ? "text-base font-normal text-gray-400 italic "
          : "text-base font-normal "
      } !bg-[#fff] w-full px-6  py-3  min-h-[140px]`}
      disabled={!hasTranslation}
    />
  );
};
