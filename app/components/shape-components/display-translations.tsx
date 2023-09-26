import SingleLine from "./single-line";
import RichText from "./rich-text";
import ParagraphCollection from "./paragraph-collection";
import ContentChunk from "./content-chunk";

const DisplayTranslations = ({
  translations,
  item,
  type,
}: {
  translations: any;
  item: { id: string; language: string };
  type: string;
}) => {
  return (
    <>
      {translations &&
        translations.map((i: any) => {
          switch (type) {
            case "singleLine":
              return <SingleLine key={i.id} data={i} item={item} />;
            case "richText":
              return <RichText key={i.id} data={i} item={item} />;
            case "paragraphCollection":
              return <ParagraphCollection key={i.id} data={i} item={item} />;
            case "contentChunk":
              return <ContentChunk key={i.id} data={i} item={item} />;
            default:
              return null;
          }
        })}
    </>
  );
};

export default DisplayTranslations;
