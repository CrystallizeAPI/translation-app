import type { Properties } from "~/use-cases/types";
type TranslationPropertiesProps = {
  properties: Properties;
};

export function TranslationProperties({
  properties,
}: TranslationPropertiesProps) {
  const { name } = properties;
  return <div>{name}</div>;
}
