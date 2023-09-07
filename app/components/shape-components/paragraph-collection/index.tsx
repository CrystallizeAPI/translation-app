import { useState } from "react";
import { componentType } from "../helpers";

const ParagraphCollection = ({
  data,
  item,
}: {
  data: any;
  item: { id: string; language: string };
}) => {
  const title = data?.type === "paragraphTitle" ? data?.translation : null;
  const body = data?.type === "paragraphBody" ? data?.translation : null;
  const [paragraphValue, setParagraphValue] = useState<any>(body);

  //   const handleClick = async (e: any) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     try {
  //       await fetch("/api/update", {
  //         method: "POST",
  //         body: JSON.stringify({
  //             id: item.id,
  //             language: item.language,
  //             componentId: data.id,
  //             content: translation
  //         })
  //       })
  //     } catch (error) {
  //         console.log(error);
  //     }
  //   };

  return (
    <div className="grid grid-cols-[160px_1fr] items-start">
      <div className="flex capitalize font-medium text-sm items-center gap-2">
        {componentType["paragraphCollection"]}
        {data?.id}
      </div>
      <form>
        <div className="mb-3 flex flex-row gap-2">
          <input type="text" className="bg-gray-50 w-full p-2" value={title} />
          <textarea
            className="leading-8 bg-gray-50 w-full p-2"
            onChange={(e) => {
              setParagraphValue(e.target.value);
            }}
          >
            {body && <p>{body}</p>}
          </textarea>

          {/* {p.images?.map((img: any) => (
                <div className="flex mb-4 items-center gap-4" key={img?.url}>
                  <div className="w-32 rounded overflow-hidden shadow">
                    <img src={img?.url} className="w-full " />
                  </div>
                  <div>
                    {img.altText ?? (
                      <span className="text-orange-500">No alt text</span>
                    )}
                  </div>
                </div>
              ))} */}
          <button className="w-[250px] bg-cyan-300 p-2 text-sm">
            Use this translation
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParagraphCollection;
