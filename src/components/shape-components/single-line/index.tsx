import type { ComponentWithTranslation } from "~/use-cases/contracts/types";
import type { SingleLineContent } from "~/__generated__/types";

export const SingleLine = ({ data }: { data: ComponentWithTranslation }) => {
    const hasTranslation = data?.translationState === "translated";

    return (
        <input
            className="px-6 py-4 !bg-[#fff] w-full"
            value={(data?.content as SingleLineContent)?.text ?? ""}
            disabled={!hasTranslation}
        />
    );
};
