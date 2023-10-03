import { useState } from "react";
import { Button, Icon } from "@crystallize/design-system";
import { translateArray } from "~/use-cases/fetch-translation";
import { getComponentByType } from "~/use-cases/get-component-type";
import { RichText, SingleLine, ComponentChoice } from "./shape-components";

export const VariantTranslationForm = ({
  data,
  language,
  toLanguage,
  productId,
}: {
  data: any;
  language: string;
  toLanguage: string;
  productId: string;
}) => {
  const [items, setItems] = useState(data);
  const [loading, setLoading] = useState(false);

  const createItemData = (item: any) => {
    return {
      id: item?.id,
      language: toLanguage,
      sku: item?.sku,
      productId,
    };
  };

  const handleTranslate = () => {
    setLoading(true);
    items.forEach(async (item: any, index: number) => {
      const components: any = {
        singleLine: getComponentByType("singleLine", item),
        richText: getComponentByType("richText", item),
        paragraphCollection: getComponentByType("paragraphCollection", item),
        contentChunk: getComponentByType("contentChunk", item),
        componentChoice: getComponentByType("componentChoice", item),
      };
      const translationPromises = [];
      for (const type in components) {
        if (components[type].length > 0) {
          const translationPromise = await translateArray(
            components[type],
            language,
            toLanguage,
            type
          );
          translationPromises.push(translationPromise);
          setItems((prevItems: any) => {
            const newItems = [...prevItems];
            newItems[index].components = newItems[index].components.map(
              (component: any) => {
                if (component.id === translationPromise[0].id) {
                  component = translationPromise[0];
                }
                return component;
              }
            );
            return newItems;
          });
        }
      }
      await Promise.all(translationPromises);
      setLoading(false);
    });
  };

  return (
    <div className="my-10 bg-[#fff] py-3 pt-5 px-5 rounded-md">
      <h2 className="font-semibold text-xl mb-4">Variant Translations</h2>
      <h3>
        This item also has components on variants. Would you like to translate
        those?
      </h3>
      <Button
        intent="action"
        onClick={handleTranslate}
        prepend={<Icon.Language width={20} height={20} />}
        className="mt-4"
        disabled={loading || items.length === 0 || !toLanguage}
      >
        Translate
      </Button>
      {loading && (
        <p className="mt-4">
          Please wait! Loading translations for the variants...
        </p>
      )}
      <div className="my-8">
        {items?.map((item: any) => (
          <div className="my-3 border-1 border-cyan-200">
            <p className="text-sm  bg-pink-100 p-3 text-gray-600">
              {item.name} <span className="text-xs">({item.sku})</span>
            </p>
            {item.components?.map((component: any) => (
              <div className="px-3 bg-pink-100">
                {component.type === "singleLine" && component?.translation && (
                  <SingleLine
                    data={component}
                    item={createItemData(item)}
                    setEditedTranslation={setItems}
                    isOnVariant={true}
                  />
                )}
                {component.type === "richText" && component?.translation && (
                  <RichText
                    data={component}
                    item={item}
                    setEditedTranslation={setItems}
                    isOnVariant={true}
                  />
                )}
                {component.type === "componentChoice" &&
                  component?.selectedComponent?.translation && (
                    <ComponentChoice
                      data={component}
                      item={createItemData(item)}
                      setEditedTranslation={setItems}
                      isOnVariant={true}
                    />
                  )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
