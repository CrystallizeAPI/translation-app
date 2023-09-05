import { componentType } from "../helpers";
const SingleLine = ({ content, id, type }) => {
  return (
    <div className="grid grid-cols-[160px_1fr] items-start gap-6 ">
      <div className="flex capitalize font-medium text-sm items-center gap-2">
        {componentType[type]}
        {id}
      </div>
      <form>
        <input
          value={content.text}
          className="bg-gray-50 w-full font-bold text-2xl"
        />
      </form>
    </div>
  );
};

export default SingleLine;
