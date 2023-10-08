import { useState } from "react";
import { Button, Icon } from "@crystallize/design-system";
import { translateArray } from "~/use-cases/fetch-translation";
import { getComponentByType } from "~/use-cases/get-component-type";
import {
  RichText,
  SingleLine,
  ComponentChoice,
  ParagraphCollection,
  ContentChunk,
} from "./shape-components";
import { Loader } from "./loader";

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

  const publishVariant = async (item: any) => {
    await fetch(`/api/update/publish-variant`, {
      method: "POST",
      body: JSON.stringify({
        productId,
        language: toLanguage,
        sku: item.sku,
        data: item.components,
      }),
    });
  };

  return (
    <div className="my-10 py-3 pt-5 px-3 rounded-md">
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
      <div className="my-8">
        {items?.map((item: any) => (
          <div className="my-3 border-1 border-cyan-200" key={item.sku}>
            <p className="text-sm  bg-pink-100 px-3 py-2 text-gray-600">
              {item.name} <span className="text-xs">({item.sku})</span>
            </p>
            {item.components?.map((component: any) => (
              <div
                className="flex flex-col gap-4 border-10 border-pink-200 px-3"
                key={component.id}
              >
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
                    item={createItemData(item)}
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
                {component.type === "paragraphCollection" &&
                  component?.paragraphs?.length > 0 && (
                    <ParagraphCollection
                      data={component}
                      item={createItemData(item)}
                      setEditedTranslation={setItems}
                      isOnVariant={true}
                    />
                  )}
                {component.type === "contentChunk" && (
                  <ContentChunk
                    data={component}
                    item={createItemData(item)}
                    setEditedTranslation={setItems}
                    isOnVariant={true}
                  />
                )}
              </div>
            ))}
            {item.components?.some(
              (component: any) => component?.translation
            ) && (
              <Button
                intent="action"
                onClick={() => publishVariant(item)}
                className="mt-4"
                disabled={loading || !toLanguage}
              >
                Publish variant to draft
              </Button>
            )}
            {loading && <Loader />}
          </div>
        ))}
      </div>
    </div>
  );
};
