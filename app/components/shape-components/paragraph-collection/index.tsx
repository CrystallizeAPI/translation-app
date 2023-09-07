import { useState } from "react";
import { componentType } from "../helpers";

const ParagraphCollection = ({
  data,
  item,
}: {
  data: any;
  item: { id: string; language: string };
}) => {
  const [titleValue, setTitleValue] = useState<any>("");
  const [bodyValue, setBodyValue] = useState<any>("");
  const [paragraphValue, setParagraphValue] = useState<any>({});
  let paragraphArr: any = [];

  const handleClick = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="grid grid-cols-[160px_1fr] items-start">
      <div className="flex capitalize font-medium text-sm items-center gap-2">
        {componentType["paragraphCollection"]}
      </div>
      <form>
        <div className="mb-3 flex flex-row gap-2 w-full">
          <div className="w-full">
            {data?.map((p: any, index: number) => {
              return (
                <div key={index}>
                  {p?.type === "paragraphTitle" && (
                    <input
                      value={p?.translation}
                      onChange={(e) => setTitleValue(e.target.value)}
                      className="bg-gray-50 w-full p-2"
                    />
                  )}
                  {p?.type === "paragraphBody" && (
                    <textarea
                      value={p?.translation}
                      onChange={(e) => setBodyValue(e.target.value)}
                      className="bg-gray-50 w-full p-2 h-[200px]"
                    />
                  )}
                  {p?.type === "paragraphImage" && (
                    <div className="w-32 rounded overflow-hidden shadow">
                      <img src={p?.url} className="w-full " />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button
            className="w-[250px] bg-cyan-300 p-2 text-sm"
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
