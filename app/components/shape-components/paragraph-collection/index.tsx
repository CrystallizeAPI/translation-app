import { useState } from "react";
import { componentType } from "../helpers";
import { CopyButton } from "~/components/copy-button";

const ParagraphCollection = ({
  data,
  item,
}: {
  data: any;
  item: { id: string; language: string };
}) => {
  const [titleValue, setTitleValue] = useState<any>("");
  const [bodyValue, setBodyValue] = useState<any>("");

  function groupAndTransformArray(arr: any[]) {
    const groupedData: any = {};

    for (const item of arr) {
      const id = item.id;
      const type = item.type.slice(-1); // Get the last character (number) from type
      const translation = item.translation;

      if (!groupedData[id]) {
        groupedData[id] = [];
      }

      let existingItem = groupedData[id].find((el: any) => el.type === type);

      if (!existingItem) {
        existingItem = { type, title: "", body: "", images: [] };
        groupedData[id].push(existingItem);
      }

      switch (item.type) {
        case `paragraphTitle${type}`:
          existingItem.title = translation;
          break;
        case `paragraphBody${type}`:
          existingItem.body = translation;
          break;
        case `paragraphImage${type}`:
          existingItem.images.push(translation);
          break;
        default:
          break;
      }
    }

    const result = Object.keys(groupedData).map((id) => ({
      [id]: groupedData[id],
    }));
    return result;
  }

  const resultArray = groupAndTransformArray(data);

  const component = Object.entries(resultArray?.[0]).flat();

  let requestBody = {
    id: item.id,
    language: item.language,
    componentId: component[0],
    content: component[1].map((p: any) => {
      return {
        title: { text: p?.title },
        body: { html: p?.body },
        images: p?.images.map((image: string) => {
          return {key: image.split(".com/")[1]};
        })
      };
    }),
    type: "paragraphCollection",
  };

  const handleClick = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await fetch("/api/update", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-[160px_1fr] items-start">
      <div className="flex capitalize font-medium text-sm items-center gap-2">
        {componentType["paragraphCollection"]}
      </div>
      <form>
        <div className="mb-3 flex flex-col gap-2 w-full">
          {resultArray.map((i: any, index: number) => (
            <div key={index}>
              {Object.values(i).map((el: any) => {
                return el.map((p: any, index: number) => (
                  <div key={index}>
                    {p?.title && (
                      <div className="w-full relative">
                        <input
                          value={p?.title}
                          onChange={(e) => setTitleValue(e.target.value)}
                          className="bg-gray-50 w-full p-2"
                          readOnly
                        />

                        <div className="absolute right-1 top-2">
                          <CopyButton text={p?.title} />
                        </div>
                      </div>
                    )}

                    {p?.body && (
                      <div className="w-full relative">
                        <textarea
                          value={p?.body}
                          onChange={(e) => setBodyValue(e.target.value)}
                          className="bg-gray-50 w-full p-2 h-[200px]"
                          readOnly
                        />

                        <div className="absolute right-1 top-2">
                          <CopyButton text={p?.body} />
                        </div>
                      </div>
                    )}
                    {p?.images &&
                      p?.images?.map((image: any) => (
                        <div className="w-32 rounded overflow-hidden shadow">
                          <img src={image} className="w-full " />
                        </div>
                      ))}
                  </div>
                ));
              })}
            </div>
          ))}
          <div className="w-full"></div>
          <button
            className="w-full bg-cyan-300 p-2 text-sm h-50 mt-2"
            onClick={handleClick}
          >
            Use this translation
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParagraphCollection;
