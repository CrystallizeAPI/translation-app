import { IconButton, Icon, Tooltip } from "@crystallize/design-system";
export const CopyButton = ({
  text,
  variant = "elevate",
}: {
  text: string;
  variant?: "elevate" | "default";
}) => {
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
    <Tooltip content="Copy to clipboard">
      <IconButton variant={variant} onClick={handleCopy}>
        <Icon.Copy />
      </IconButton>
    </Tooltip>
  );
};
