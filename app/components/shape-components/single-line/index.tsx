import { CopyButton } from "~/components/copy-button";
import { componentType } from "../helpers";
import { useState } from "react";

const SingleLine = ({
  data,
  item,
}: {
  data: any;
  item: {
    id: string;
    language: string;
  };
}) => {
  const [translation, setTranslation] = useState<any>(data.translation);

  const handleClick = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await fetch("/api/update", {
        method: "POST",
        body: JSON.stringify({
          id: item.id,
          language: item.language,
          componentId: data.id,
          content: translation,
          type: "singleLine",
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-[160px_1fr] items-start">
      <div className="flex capitalize font-medium text-sm items-center gap-2">
        {componentType["singleLine"]}
        {data?.id}
      </div>
      <form className="flex flex-col gap-2">
        <input
          value={translation}
          className="bg-gray-50 w-full p-2"
          onChange={(e) => setTranslation(e.target.value)}
        />
        <div className="flex flex-row gap-2 w-full justify-end mt-2">
          <button
            className="w-[250px] bg-cyan-300 p-2 text-sm"
            onClick={handleClick}
          >
            Use this translation
          </button>
          <CopyButton text={translation} />
        </div>
      </form>
    </div>
  );
};

export default SingleLine;
