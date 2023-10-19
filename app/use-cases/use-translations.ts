import { useCallback, useState } from "react";
import { getComponentTranslation } from "~/use-cases/fetch-translation";
import type {
  Component,
  ComponentChoiceContent,
  ContentChunkContent,
} from "~/__generated__/types";
import type { ComponentsWithTranslation, Preferences } from "./types";

type UpdateComponent = {
  componentIndex: number;
  chunkIndex?: number;
  chunkComponentIndex?: number;
  translation?: any;
  isTranslating?: boolean;
  isChoice?: boolean;
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
  const [processingTranslations, setProcessingTranslations] = useState<
    Map<string, boolean>
  >(new Map());
  const [componentsWithTranslation, setComponentsWithTranslation] =
    useState<ComponentsWithTranslation[]>(components);
  const currentProcessingTranslationsCount = [
    ...processingTranslations.values(),
  ].filter(Boolean).length;
  const totalProcessingTranslationsCount = processingTranslations.size;

  const updateComponent = useCallback(
    ({
      componentIndex,
      chunkIndex,
      chunkComponentIndex,
      translation,
      isChoice = false,
      isTranslating = false,
    }: UpdateComponent) => {
      setComponentsWithTranslation((prev) => {
        const copy = [...prev];
        let component = copy[componentIndex];

        if (isChoice) {
          component = (copy[componentIndex].content as ComponentChoiceContent)
            .selectedComponent;
        } else if (
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

  const handleChunkTranslation = useCallback(
    (
      component: Component,
      componentIndex: number,
      preferences: Preferences
    ) => {
      (component?.content as ContentChunkContent)?.chunks.forEach(
        async (chunkComponents, chunkIndex) => {
          chunkComponents.forEach(
            async (chunkComponent, chunkComponentIndex) => {
              const id = `${component.id}-${chunkComponentIndex}-${chunkComponent.id}`;
              setProcessingTranslations((prev) => new Map(prev.set(id, true)));

              const base = {
                componentIndex,
                chunkIndex,
                chunkComponentIndex,
              };

              try {
                updateComponent({ ...base, isTranslating: true });
                const data = await getComponentTranslation(
                  translateLanguage,
                  chunkComponent,
                  preferences
                );
                updateComponent({
                  ...base,
                  isTranslating: false,
                  translation: data?.translation,
                });
              } catch {
                updateComponent({ ...base, isTranslating: false });
                // TODO: show error message
              } finally {
                setProcessingTranslations(
                  (prev) => new Map(prev.set(id, false))
                );
              }
            }
          );
        }
      );
    },
    [translateLanguage, updateComponent]
  );

  const handleChoiceTranslation = useCallback(
    async (
      component: Component,
      componentIndex: number,
      preferences: Preferences
    ) => {
      setProcessingTranslations(
        (prev) => new Map(prev.set(component.id, true))
      );

      try {
        updateComponent({
          componentIndex,
          isTranslating: true,
          isChoice: true,
        });
        const data = await getComponentTranslation(
          translateLanguage,
          component,
          preferences
        );
        updateComponent({
          componentIndex,
          isTranslating: false,
          translation: data?.translation,
          isChoice: true,
        });
      } catch {
        updateComponent({ componentIndex, isTranslating: false });
        // TODO: show error message
      } finally {
        setProcessingTranslations(
          (prev) => new Map(prev.set(component.id, false))
        );
      }
    },
    [translateLanguage, updateComponent]
  );

  const handleBaseComponentTranslation = useCallback(
    async (
      component: Component,
      componentIndex: number,
      preferences: Preferences
    ) => {
      setProcessingTranslations(
        (prev) => new Map(prev.set(component.id, true))
      );

      try {
        updateComponent({ componentIndex, isTranslating: true });
        const data = await getComponentTranslation(
          translateLanguage,
          component,
          preferences
        );
        updateComponent({
          componentIndex,
          isTranslating: false,
          translation: data?.translation,
        });
      } catch {
        updateComponent({ componentIndex, isTranslating: false });
        // TODO: show error message
      } finally {
        setProcessingTranslations(
          (prev) => new Map(prev.set(component.id, false))
        );
      }
    },
    [translateLanguage, updateComponent]
  );

  const onTranslate = useCallback(
    async (preferences: Preferences) => {
      setProcessingTranslations(new Map());

      components.forEach((component, componentIndex) => {
        if (component.type === "contentChunk") {
          return handleChunkTranslation(component, componentIndex, preferences);
        }

        if (component.type === "componentChoice") {
          return handleChoiceTranslation(
            (component.content as ComponentChoiceContent).selectedComponent,
            componentIndex,
            preferences
          );
        }

        return handleBaseComponentTranslation(
          component,
          componentIndex,
          preferences
        );
      });
    },
    [
      components,
      handleChoiceTranslation,
      handleChunkTranslation,
      handleBaseComponentTranslation,
    ]
  );

  const onChangeLanguage = useCallback(
    (lang: typeof translateLanguage) => setTranslateLanguage(lang),
    []
  );

  const handlePublishAll = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await fetch("/api/update/all-items", {
      method: "POST",
      body: JSON.stringify({
        data: [
          // ...singleLineTranslations,
          // ...richTextTranslations,
          // ...paragraphCollectionTranslations,
          // ...contentChunkTranslations,
        ],
        language: translateLanguage.to,
        itemId: item.id,
      }),
    });
  };

  return {
    componentsWithTranslation,
    onTranslate,
    translateLanguage,
    onChangeLanguage,
    currentProcessingTranslationsCount,
    totalProcessingTranslationsCount,
  };
};
