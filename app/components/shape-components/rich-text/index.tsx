import { useState } from "react";
import { componentType } from "../helpers";

const RichText = ({
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
          type: "richText"
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-[160px_1fr] items-start">
      <div className="flex capitalize font-medium text-sm items-center gap-2">
        {componentType["richText"]}
        {data?.id}
      </div>
      <form className="flex flex-row gap-2">
        <textarea
          value={translation}
          className="bg-gray-50 w-full p-2"
          onChange={(e) => setTranslation(e.target.value)}
        />
        <button
          className="w-[250px] bg-cyan-300 p-2 text-sm"
          onClick={handleClick}
        >
          Use this translation
        </button>
      </form>
    </div>
  );
};

export default RichText;
