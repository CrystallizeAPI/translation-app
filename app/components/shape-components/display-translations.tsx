import SingleLine from "./single-line";
import RichText from "./rich-text";
import ParagraphCollection from "./paragraph-collection";

const DisplayTranslations = ({
  translations,
  item,
}: {
  translations: any;
  item: { id: string; language: string };
}) => {
  const getComponentByType = (type: string) => {
    return translations?.filter((comp: any) => {
      return comp.type === type;
    });
  };

  const singleLineTranslations = getComponentByType("singleLine");
  const richTextTranslations = getComponentByType("richText");

  const paragraphTranslations = translations?.filter((comp: any) => {
    return comp?.type?.startsWith("para");
  });

  return (
    <div className="max-w-[800px] mx-auto flex flex-col gap-5">
      {singleLineTranslations &&
        singleLineTranslations.map((translation: any) => {
          return (
            <SingleLine key={translation.id} data={translation} item={item} />
          );
        })}
      {richTextTranslations &&
        richTextTranslations.map((translation: any) => {
          return (
            <RichText key={translation.id} data={translation} item={item} />
          );
        })}
      {paragraphTranslations &&
        paragraphTranslations.map((translation: any) => {
          return (
            <ParagraphCollection key={translation.id} data={translation} item={item} />
          );
        })}
        
    </div>
  );
};

export default DisplayTranslations;
