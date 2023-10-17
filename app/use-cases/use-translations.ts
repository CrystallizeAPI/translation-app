import { useCallback, useState } from "react";
import { getComponentTranslation } from "~/use-cases/fetch-translation";
import type { Component, ContentChunkContent } from "~/__generated__/types";

type UpdateComponent = {
  componentIndex: number;
  chunkIndex?: number;
  chunkComponentIndex?: number;
  translation?: any;
  isTranslating?: boolean;
};

type Translation = string | { title?: string; body?: string }[];

type ComponentsWithTranslation = Component & {
  isTranslating?: boolean;
  translation?: Translation;
};

type UseTranslationsProps = {
  language: string;
  components: Component[];
};

export const useTranslations = ({
  language,
  components,
}: UseTranslationsProps) => {
  const [translateLanguage, setTranslateLanguage] = useState({
    from: language,
    to: "",
  });
  const [componentsWithTranslation, setComponentsWithTranslation] =
    useState<ComponentsWithTranslation[]>(components);

  const updateComponent = useCallback(
    ({
      componentIndex,
      chunkIndex,
      chunkComponentIndex,
      translation,
      isTranslating = false,
    }: UpdateComponent) => {
      setComponentsWithTranslation((prev) => {
        const copy = [...prev];
        let component = copy[componentIndex];

        if (
          typeof chunkIndex === "number" &&
          typeof chunkComponentIndex === "number"
        ) {
          component = (copy[componentIndex].content as ContentChunkContent)
            .chunks[chunkIndex][
            chunkComponentIndex
          ] as ComponentsWithTranslation;
        }

        component.isTranslating = isTranslating;
        component.translation = translation;

        return copy;
      });
    },
    []
  );

  const handleTranslate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      components.forEach(async (component, componentIndex) => {
        if (component.type !== "contentChunk") {
          try {
            updateComponent({ componentIndex, isTranslating: true });
            const data = await getComponentTranslation(
              translateLanguage,
              component
            );
            updateComponent({
              componentIndex,
              isTranslating: false,
              translation: data?.translation,
            });
          } catch {
            updateComponent({ componentIndex, isTranslating: false });
            // TODO: show error message
          }

          return;
        }

        (component?.content as ContentChunkContent)?.chunks.forEach(
          async (chunkComponents, chunkIndex) => {
            chunkComponents.forEach(
              async (chunkComponent, chunkComponentIndex) => {
                const base = {
                  componentIndex,
                  chunkIndex,
                  chunkComponentIndex,
                };

                try {
                  updateComponent({ ...base, isTranslating: true });
                  const data = await getComponentTranslation(
                    translateLanguage,
                    chunkComponent
                  );
                  updateComponent({
                    ...base,
                    isTranslating: false,
                    translation: data?.translation,
                  });
                } catch {
                  updateComponent({ ...base, isTranslating: false });
                  // TODO: show error message
                }
              }
            );
          }
        );
      });
    },
    [components, updateComponent, translateLanguage]
  );

  const onChangeLanguage = useCallback(
    (lang: typeof translateLanguage) => setTranslateLanguage(lang),
    []
  );

  return {
    componentsWithTranslation,
    handleTranslate,
    translateLanguage,
    onChangeLanguage,
  };
};
