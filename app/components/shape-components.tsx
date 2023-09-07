import SingleLine from "./shape-components/single-line";
import RichText from "./shape-components/rich-text";
import ParagraphCollection from "./shape-components/paragraph-collection";

const ShapeComponents = ({ components }: {components: any}) => {
  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1,4" }}
      className="min-h-[100vh] bg-gray-50  "
    >
      <div className="flex flex-col gap-4 max-w-3xl mx-auto pt-10">
        {components.map((cmp: any, index: number) => {
          const componentTypes = {
            singleLine: <SingleLine {...cmp} />,
            richText: <RichText {...cmp} />,
            paragraphCollection: <ParagraphCollection {...cmp} />,
          };
          return (
            // @ts-expect-error
            componentTypes[cmp.type] || (
              <div key={index}>{`${cmp.type} not supported yet`}</div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default ShapeComponents;
