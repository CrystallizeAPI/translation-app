import SingleLine from "./single-line";
import RichText from "./rich-text";
import ParagraphCollection from "./paragraph-collection";
import ContentChunk from "./content-chunk";

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

  const contentChunkTranslations = translations?.filter((comp: any) => {
    return comp?.type?.startsWith("contentChunk");
  })

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-5">
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
      {paragraphTranslations && (
        <ParagraphCollection data={paragraphTranslations} item={item} />
      )}
        {contentChunkTranslations && (
            <ContentChunk data={contentChunkTranslations} item={item} />
        )}
    </div>
  );
};

export default DisplayTranslations;
