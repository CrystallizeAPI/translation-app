export const CopyButton = ({ text }: { text: string }) => {
  const handleCopy = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button className="bg-gray-100 py-2 px-4 text-sm" onClick={handleCopy}>
      📋
    </button>
  );
};
