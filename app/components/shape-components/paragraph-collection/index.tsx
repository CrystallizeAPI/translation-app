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

  const [paragraphData, setParagraphData] = useState<any>(resultArray);

  const handleClick = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      //run this for every item in paragraphData
      paragraphData.map(async (paragraph: any) => {
        const key = Object.keys(paragraph)[0];
        const values = paragraph[key];
        values.map(async (el: any) => {
          const body = {
            id: item.id,
            language: item.language,
            componentId: key,
            content: {
              title: { text: el?.title },
              body: { html: el?.body },
              images: el?.images.map((image: string) => {
                return { key: image.split(".com/")[1] };
              }),
            },
            type: "paragraphCollection",
          };
          await fetch("/api/update", {
            method: "POST",
            body: JSON.stringify(body),
          });
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form>
      <div className="mb-3 flex flex-col gap-2 w-full">
        {paragraphData &&
          paragraphData.map((item: any, index: number) => {
            const key = Object.keys(item)[0];
            const values = item[key];
            return (
              <div
                key={index}
                className="grid grid-cols-[160px_1fr] items-start"
              >
                <div className="flex capitalize font-medium text-sm gap-2">
                  {componentType["paragraphCollection"]}
                  <p>{key}</p>
                </div>
                {values.map((el: any, innerIndex: number) => {
                  return (
                    <div key={innerIndex} className="w-full">
                      <div className="relative">
                        <input
                          value={el?.title}
                          className="bg-gray-50 w-full p-2"
                          onChange={(e) => {
                            const newParagraphData = [...paragraphData];
                            newParagraphData[index][key][innerIndex].title =
                              e.target.value;
                            setParagraphData(newParagraphData);
                          }}
                        />
                        <div className="absolute right-1 top-2">
                          <CopyButton text={el?.title} />
                        </div>
                      </div>
                      <div className="w-full relative">
                        <textarea
                          value={el?.body}
                          className="bg-gray-50 w-full p-2 h-[200px]"
                          onChange={(e) => {
                            const newParagraphData = [...paragraphData];
                            newParagraphData[index][key][innerIndex].body =
                              e.target.value;
                            setParagraphData(newParagraphData);
                          }}
                        />
                        <div className="absolute right-1 top-2">
                          <CopyButton text={el?.body} />
                        </div>
                      </div>
                      {el?.images &&
                        el?.images?.map((image: any, index: number) => (
                          <div
                            className="w-32 rounded overflow-hidden shadow"
                            key={index}
                          >
                            <img src={image} className="w-full " />
                          </div>
                        ))}
                    </div>
                  );
                })}
              </div>
            );
          })}

        <button
          className="bg-cyan-300 p-2 text-sm h-50 mt-2 w-[250px] self-end"
          onClick={handleClick}
        >
          Use this translation
        </button>
      </div>
    </form>
  );
};

export default ParagraphCollection;
