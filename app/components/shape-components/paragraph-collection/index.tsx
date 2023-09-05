import { componentType } from "../helpers";
import { ContentTransformer } from "@crystallize/reactjs-components";
const ParagraphCollection = ({ content, id, type }) => {
  const paragraphs = content?.paragraphs ?? [];
  return (
    <div className="grid grid-cols-[160px_1fr] items-start gap-6">
      <div className="flex capitalize font-medium text-sm items-center gap-2">
        {componentType[type]}
        {id}
      </div>
      <form>
        {paragraphs.map((p) => {
          return (
            <div className="mb-16">
              <input
                className="font-bold w-full bg-gray-50 text-xl"
                value={p.title.text}
              />
              <div className="leading-8 [&_p]:mb-8">
                <ContentTransformer json={p.body.json} />
              </div>
              {p.images?.map((img) => (
                <div className="flex mb-4 items-center gap-4" key={img.url}>
                  <div className="w-32 rounded overflow-hidden shadow">
                    <img src={img.url} className="w-full " />
                  </div>
                  <div>
                    {img.altText ?? (
                      <span className="text-orange-500">No alt text</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </form>
    </div>
  );
};

export default ParagraphCollection;
