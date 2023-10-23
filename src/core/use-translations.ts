import { useCallback, useEffect, useState } from "react";

import type {
    Component,
    ComponentChoiceContent,
    ContentChunkContent,
    ItemType,
} from "~/__generated__/types";
import { ComponentType } from "~/__generated__/types";
import type {
    ComponentWithTranslation,
    Preferences,
    PropertyWithTranslation,
} from "../use-cases/contracts/types";


import { signal } from "@crystallize/app-signal";
import { useFetcher } from "@remix-run/react";
import { allowedTypes } from "../use-cases/contracts/allowed-components";
import { translateComponentType } from "~/use-cases/translations/translate-component-type";
import { Translator, TranslatorArgs } from "./translator.server";
import { SerializeFrom } from "@remix-run/node";

type UpdateComponent = {
    type: ComponentType;
    componentIndex: number;
    chunkIndex?: number;
    chunkComponentIndex?: number;
    translation?: any;
    translationState?: ComponentWithTranslation["translationState"];
    isChoice?: boolean;
};

type UpdateProperty = {
    propertyIndex: number;
    translation?: any;
    translationState?: ComponentWithTranslation["translationState"];
};

type UseTranslationsProps = {
    itemId: string;
    itemType: ItemType;
    language: string;
    properties: SerializeFrom<PropertyWithTranslation[] | null>;
    components?: SerializeFrom<Component[] | null>;
    variantSku?: string;
};

type HandleTranslationProps = {
    componentIndex: number;
    preferences: Preferences;
    variantSku?: string;
    component?: Component;
};

type HandlePropertyProps = {
    property: PropertyWithTranslation;
    propertyIndex: number;
    preferences: Preferences;
};

const translator: Translator = {
    translate: async (args: TranslatorArgs) => {
        const results = await fetch("/api/translate/v2", {
            method: "POST",
            body: JSON.stringify(args),
        });
        const json = await results.json();
        return json.translation;
    }
}

export const useTranslations = ({
    itemId,
    itemType,
    language,
    components,
    variantSku,
    properties,
}: UseTranslationsProps) => {
    const fetcher = useFetcher();
    const [translateLanguage, setTranslateLanguage] = useState({
        from: language,
        to: "",
    });
    const [processingTranslations, setProcessingTranslations] = useState<
        Map<string, boolean>
    >(new Map());
    const [propertiesWithTranslation, setPropertiesWithTranslation] =
        useState<SerializeFrom<PropertyWithTranslation[] | null>>(properties);
    const [componentWithTranslation, setComponentWithTranslation] = useState<
        SerializeFrom<ComponentWithTranslation[] | null> | undefined
    >(components);

    const currentProcessingTranslationsCount = [
        ...processingTranslations.values(),
    ].filter(Boolean).length;
    const totalProcessingTranslationsCount = processingTranslations.size;

    useEffect(() => {
        // This has to run from the client as we post messages between iframe and parent
        if (fetcher.data) {
            const { type, itemId, language: itemLanguage } = fetcher.data as any;
            signal.send(type, { itemId, itemLanguage });
        }
    }, [fetcher.data]);

    const onUpdateComponent = useCallback(
        async (
            translation: ComponentWithTranslation | PropertyWithTranslation,
            type: string = "component"
        ) => {
            const formData = new FormData();
            const data = JSON.stringify({
                translation,
                type,
                itemType,
                itemId,
                variantSku,
                language: translateLanguage.to,
            });

            formData.append("data", data);
            fetcher.submit(formData, { method: "POST" });
        },
        [itemId, translateLanguage.to, variantSku, fetcher, itemType]
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
            let rootComponent: ComponentWithTranslation | undefined = undefined;

            setComponentWithTranslation((prev = []) => {
                const copy = [...prev];
                let component = copy[componentIndex];

                if (isChoice) {
                    component = (copy[componentIndex].content as ComponentChoiceContent)
                        ?.selectedComponent;
                } else if (
                    typeof chunkIndex === "number" &&
                    typeof chunkComponentIndex === "number"
                ) {
                    component = (copy[componentIndex].content as ContentChunkContent)
                        .chunks[chunkIndex][
                        chunkComponentIndex
                    ] as ComponentWithTranslation;
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

    const updateProperty = useCallback(
        ({ propertyIndex, translation, translationState }: UpdateProperty) => {
            let updatedProperty: PropertyWithTranslation | undefined = undefined;

            setPropertiesWithTranslation((prev) => {
                const copy = [...prev];
                let property = copy[propertyIndex];

                property.translationState = translationState;
                if (translation) {
                    property.content = translation;
                }

                updatedProperty = copy[propertyIndex];

                return copy;
            });

            return updatedProperty;
        },
        []
    );

    const handleChunkTranslation = useCallback(
        ({ component, componentIndex, preferences }: HandleTranslationProps) => {
            (component?.content as ContentChunkContent)?.chunks.forEach(
                (chunkComponents, chunkIndex) => {
                    chunkComponents.forEach((chunkComponent, chunkComponentIndex) => {
                        (async () => {
                            if (!allowedTypes.includes(chunkComponent.type)) {
                                return;
                            }

                            const id = `${component?.componentId}-${chunkComponentIndex}-${chunkComponent.componentId}`;
                            const base = {
                                type: chunkComponent.type,
                                componentIndex,
                                chunkIndex,
                                chunkComponentIndex,
                            };

                            setProcessingTranslations((prev) => new Map(prev.set(id, true)));

                            try {
                                updateComponent({ ...base, translationState: "translating" });
                                const data = await translateComponentType(
                                    translateLanguage,
                                    chunkComponent,
                                    preferences,
                                    { translator }
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
        async ({
            component,
            componentIndex,
            preferences,
        }: HandleTranslationProps) => {
            if (!component) {
                return;
            }

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
                const data = await translateComponentType(
                    translateLanguage,
                    component,
                    preferences,
                    { translator }
                );
                const updatedComponent = updateComponent({
                    type: component.type,
                    componentIndex,
                    translationState: "translated",
                    translation: data?.translation,
                    isChoice: true,
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
    const handleBaseComponentTranslation = useCallback(
        async ({
            component,
            componentIndex,
            preferences,
        }: HandleTranslationProps) => {
            if (!component) {
                return;
            }

            setProcessingTranslations(
                (prev) => new Map(prev.set(component.componentId, true))
            );

            try {
                updateComponent({
                    type: component.type,
                    componentIndex,
                    translationState: "translating",
                });
                const data = await translateComponentType(
                    translateLanguage,
                    component,
                    preferences,
                    { translator }
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

    const handleNameTranslation = useCallback(
        async ({ property, propertyIndex, preferences }: HandlePropertyProps) => {
            setProcessingTranslations(
                (prev) => new Map(prev.set(property.type, true))
            );

            try {
                updateProperty({ propertyIndex, translationState: "translating" });
                const translation = await translator.translate(
                    {
                        text: property.content,
                        language: translateLanguage,
                        preferences,
                    }
                );
                const updatedProperty = updateProperty({
                    propertyIndex,
                    translation,
                    translationState: "translated",
                });
                preferences.shouldPushTranslationToDraft &&
                    !!updatedProperty &&
                    onUpdateComponent(updatedProperty, "property");
            } catch {
                updateProperty({
                    propertyIndex,
                    translationState: "error",
                });
                // TODO: show error message
            } finally {
                setProcessingTranslations(
                    (prev) => new Map(prev.set(property.type, false))
                );
            }
        },
        [translateLanguage, updateProperty, onUpdateComponent]
    );

    const onTranslate = useCallback(
        (preferences: Preferences) => {
            setProcessingTranslations(new Map());

            properties.forEach((property, propertyIndex) => {
                if (property.type === "name") {
                    return handleNameTranslation({
                        property,
                        propertyIndex,
                        preferences,
                    });
                }
            });

            components?.forEach((component, componentIndex) => {
                const props = { component, componentIndex, preferences };

                if (component.type === "contentChunk") {
                    return handleChunkTranslation(props);
                }

                if (component.type === "componentChoice") {
                    return handleChoiceTranslation({
                        ...props,
                        component: (component.content as ComponentChoiceContent)
                            ?.selectedComponent,
                    });
                }

                allowedTypes.includes(component.type) &&
                    handleBaseComponentTranslation(props);
            });
        },
        [
            components,
            properties,
            handleChoiceTranslation,
            handleChunkTranslation,
            handleBaseComponentTranslation,
            handleNameTranslation,
        ]
    );

    const onChangeLanguage = useCallback(
        (lang: typeof translateLanguage) => setTranslateLanguage(lang),
        []
    );

    return {
        componentWithTranslation,
        propertiesWithTranslation,
        onTranslate,
        translateLanguage,
        onChangeLanguage,
        currentProcessingTranslationsCount,
        totalProcessingTranslationsCount,
    };
};