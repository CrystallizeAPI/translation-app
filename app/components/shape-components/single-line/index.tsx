import { CopyButton } from "~/components/copy-button";

const SingleLine = ({
  data,
  setEditedTranslation,
  isOnVariant,
  isStructuralComponent,
  structuralColor,
}: {
  isStructuralComponent?: boolean;
  structuralColor?: string;
  data: {
    id: string;
    type: string;
    translation?: string;
    content?: string;
  };
  setEditedTranslation: any;
  loading: boolean;
  renderType?: "default" | "variant" | "structural";
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
    <form>
      <input
        className="px-6 py-4 !bg-[#fff] w-full"
        value={data?.translation ?? data?.content?.text ?? ""}
        disabled={!hasTranslation}
        onChange={(e) => (isOnVariant ? onVariantChange(e) : onChange(e))}
      />
    </form>
  );
};

export default SingleLine;
