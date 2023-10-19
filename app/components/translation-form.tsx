import ComponentFactory from "./shape-components/componentFactory";
import type {
  ContentChunkContent,
  ComponentChoiceContent,
} from "~/__generated__/types";
import { componentType } from "./shape-components/helpers";
import type { ComponentsWithTranslation } from "../use-cases/types";

type TranslationFormProps = {
  components: ComponentsWithTranslation[];
};

export function TranslationForm({ components }: TranslationFormProps) {
  return (
    <div className="py-6 border-b border-0 border-solid border-gray-200">
      <div className="space-y-4">
        {components.map((component) => {
          const { type } = component;

          if (type === "contentChunk") {
            return (
              <div key={component.id} className="space-y-4">
                {(component.content as ContentChunkContent)?.chunks.map(
                  (chunk, index) => {
                    return (
                      <div
                        key={index}
                        className="bg-s-pink-100  pl-4 pt-4 rounded-md"
                      >
                        <div className="flex capitalize h-7 pb-4 items-center font-medium text-sm gap-2">
                          <div className="-mr-1">
                            {componentType["contentChunk"]}
                          </div>
                          <span className="font-medium text-xs text-s-pink-500">
                            {component?.id} {`#${index + 1}`}
                          </span>
                        </div>

                        <div className="overflow-hidden rounded-tl-md">
                          {chunk.map((chunkComponent) => (
                            <ComponentFactory
                              structuralColor="text-s-pink-500"
                              isStructuralComponent
                              key={chunkComponent.id}
                              component={chunkComponent}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            );
          }

          if (type === "componentChoice") {
            return (
              <div
                className="pl-4 pt-4 rounded-md bg-purple-100"
                key={component.id}
              >
                <div className="flex capitalize h-7 pb-4 items-center font-medium text-sm gap-2">
                  <div className="-mr-1">{componentType[type]}</div>
                  <span className="font-medium text-xs text-purple-500">
                    {component?.id}
                  </span>
                </div>
                <div className="overflow-hidden rounded-tl-md">
                  <ComponentFactory
                    isStructuralComponent
                    structuralColor="text-purple-500"
                    component={
                      (component.content as ComponentChoiceContent)
                        .selectedComponent
                    }
                  />
                </div>
              </div>
            );
          }

          return (
            <div key={component.id}>
              <ComponentFactory component={component} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
