import { componentType } from "../helpers";
import { CopyButton } from "~/components/copy-button";
import { IconButton, Icon, Tooltip } from "@crystallize/design-system";
import TextareaAutosize from "react-textarea-autosize";

const RichText = ({
  data,
  item,
  setEditedTranslation,
  isOnVariant,
}: {
  data: {
    id: string;
    type: string;
    translation: string;
  };
  item: {
    id: string;
    language: string;
    sku?: string;
    productId?: string;
  };
  setEditedTranslation: any;
  isOnVariant?: boolean;
}) => {
  const hasTranslation = data?.translation;

  const onChange = (e: any) => {
    setEditedTranslation((prev: any) => {
      return prev.map((i: any) =>
        i.id === data.id ? { ...i, translation: e.target.value } : i
      );
    });
  };

  const onVariantChange = (e: any) => {
    setEditedTranslation((prev: any) => {
      return prev.map((i: any) => {
        const newItem = { ...i };
        if (i?.id === item?.id) {
          newItem.components = newItem.components.map((component: any) => {
            if (component?.id === data?.id) {
              component.translation = e.target.value;
            }
            return component;
          });
        }
        return newItem;
      });
    });
  };

  return (
    <form className="w-full gap-2 relative">
      <TextareaAutosize
        value={
          data?.translation ?? data?.content?.plainText?.map((a) => a) ?? ""
        }
        disabled={!hasTranslation}
        className={`!bg-[#fff] px-6 py-4 min-h-[140px] rounded-md  w-full focus:outline-purple-200 ${
          !hasTranslation
            ? "text-base font-normal text-gray-400 italic shadow"
            : "text-base font-medium "
        }`}
        onChange={isOnVariant ? onVariantChange : onChange}
      />
    </form>
  );
};

export default RichText;
