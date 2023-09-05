import { componentType } from "../helpers";

const RichText = ({ content, id, type }) => {
  const text = content?.plainText?.map((line) => line);

  return (
    <div className="grid grid-cols-[160px_1fr] items-start gap-6">
      <div className="flex capitalize font-medium text-sm items-center gap-2">
        {componentType[type]}
        {id}
      </div>
      <form>
        <div className="bg-transparent">{text}</div>
      </form>
    </div>
  );
};

export default RichText;
