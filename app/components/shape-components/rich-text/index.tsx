import TextareaAutosize from "react-textarea-autosize";

const RichText = ({
  data,
  item,
  isStructuralComponent,
  setEditedTranslation,
  isOnVariant,
  structuralColor,
}: {
  data: {
    id: string;
    type: string;
    translation: string;
  };
  isStructuralComponent?: boolean;
  structuralColor?: string;
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
    <TextareaAutosize
      value={data?.translation ?? data?.content?.plainText?.map((a) => a) ?? ""}
      className={`${
        !hasTranslation
          ? "text-base font-normal text-gray-400 italic "
          : "text-base font-normal "
      } !bg-[#fff] w-full px-6  py-3  min-h-[140px]`}
      disabled={!hasTranslation}
      onChange={isOnVariant ? onVariantChange : onChange}
    />
  );
};

export default RichText;
