import { useCallback, useState } from "react";
import { getComponentTranslation } from "~/use-cases/fetch-translation";
import type {
  Component,
  ComponentChoiceContent,
  ContentChunkContent,
} from "~/__generated__/types";
import { ComponentType } from "~/__generated__/types";
import type { ComponentsWithTranslation, Preferences } from "./types";
import { allowedTypes } from "~/use-cases/allowed-component-types";

type UpdateComponent = {
  type: ComponentType;
  componentIndex: number;
  chunkIndex?: number;
  chunkComponentIndex?: number;
  translation?: any;
  translationState?: ComponentsWithTranslation["translationState"];
  isChoice?: boolean;
};

type UseTranslationsProps = {
  itemId: string;
  language: string;
  components: Component[];
};

export const useTranslations = ({
  itemId,
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

  const onUpdateComponent = useCallback(
    async (component: ComponentsWithTranslation) => {
      await fetch("/api/update/component", {
        method: "POST",
        body: JSON.stringify({
          component,
          itemId,
          language: translateLanguage.to,
        }),
      });
    },
    [itemId, translateLanguage.to]
  );

  const updateComponent = useCallback(
    ({
      type,
      componentIndex,
      chunkIndex,
      chunkComponentIndex,
      translation,
      isChoice = false,
      translationState,
    }: UpdateComponent) => {
      let rootComponent: ComponentsWithTranslation | undefined = undefined;

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

        component.translationState = translationState;

        if (translationState === "translated") {
          if (type === ComponentType.SingleLine) {
            component.content = { text: translation };
          } else if (type === ComponentType.RichText) {
            component.content = { plainText: translation };
          } else if (type === ComponentType.ParagraphCollection) {
            component.content = { paragraphs: translation };
          }
        }

        rootComponent = copy[componentIndex];

        return copy;
      });

      return rootComponent;
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
        (chunkComponents, chunkIndex) => {
          chunkComponents.forEach((chunkComponent, chunkComponentIndex) => {
            (async () => {
              if (!allowedTypes.includes(chunkComponent.type)) {
                return;
              }

              const id = `${component.componentId}-${chunkComponentIndex}-${chunkComponent.componentId}`;
              const base = {
                type: chunkComponent.type,
                componentIndex,
                chunkIndex,
                chunkComponentIndex,
              };

              setProcessingTranslations((prev) => new Map(prev.set(id, true)));

              try {
                updateComponent({ ...base, translationState: "translating" });
                const data = await getComponentTranslation(
                  translateLanguage,
                  chunkComponent,
                  preferences
                );
                const component = updateComponent({
                  ...base,
                  translationState: "translated",
                  translation: data?.translation,
                });
                preferences.shouldPushTranslationToDraft &&
                  !!component &&
                  onUpdateComponent(component);
              } catch {
                updateComponent({ ...base, translationState: "error" });
                // TODO: show error message
              } finally {
                setProcessingTranslations(
                  (prev) => new Map(prev.set(id, false))
                );
              }
            })();
          });
        }
      );
    },
    [translateLanguage, updateComponent, onUpdateComponent]
  );

  const handleChoiceTranslation = useCallback(
    async (
      component: Component,
      componentIndex: number,
      preferences: Preferences
    ) => {
      setProcessingTranslations(
        (prev) => new Map(prev.set(component.componentId, true))
      );

      try {
        updateComponent({
          type: component.type,
          componentIndex,
          translationState: "translating",
          isChoice: true,
        });
        const data = await getComponentTranslation(
          translateLanguage,
          component,
          preferences
        );
        updateComponent({
          type: component.type,
          componentIndex,
          translationState: "translated",
          translation: data?.translation,
          isChoice: true,
        });
      } catch {
        updateComponent({
          type: component.type,
          componentIndex,
          translationState: "error",
        });
        // TODO: show error message
      } finally {
        setProcessingTranslations(
          (prev) => new Map(prev.set(component.componentId, false))
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
        (prev) => new Map(prev.set(component.componentId, true))
      );

      try {
        updateComponent({
          type: component.type,
          componentIndex,
          translationState: "translating",
        });
        const data = await getComponentTranslation(
          translateLanguage,
          component,
          preferences
        );
        const updatedComponent = updateComponent({
          type: component.type,
          componentIndex,
          translationState: "translated",
          translation: data?.translation,
        });
        preferences.shouldPushTranslationToDraft &&
          !!updatedComponent &&
          onUpdateComponent(updatedComponent);
      } catch {
        updateComponent({
          type: component.type,
          componentIndex,
          translationState: "error",
        });
        // TODO: show error message
      } finally {
        setProcessingTranslations(
          (prev) => new Map(prev.set(component.componentId, false))
        );
      }
    },
    [translateLanguage, updateComponent, onUpdateComponent]
  );

  const onTranslate = useCallback(
    (preferences: Preferences) => {
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

  return {
    componentsWithTranslation,
    onTranslate,
    translateLanguage,
    onChangeLanguage,
    currentProcessingTranslationsCount,
    totalProcessingTranslationsCount,
  };
};
