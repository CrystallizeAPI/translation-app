import { apiClient } from "./shared";

export async function getItemFromPath(path: string, language: string) {
  const data = await apiClient.catalogueApi(
    `#graphql
          query ($path: String!, $version: VersionLabel, $language: String!) {
            catalogue(path: $path, language: $language, version:$version) {
              id
              name
              path
              components {
                id
                name
                type
                content {
                  ...componentsContent
                }
              }
            }
          }
          fragment componentsContent on ComponentContent {
            ... on SingleLineContent {
              text
            }
            ... on RichTextContent {
              plainText
            }
            ... on ParagraphCollectionContent {
              paragraphs {
                title {
                  text
                }
                body {
                  plainText
                }
                images {
                  url
                  altText

                }
              }
            }
          }

        `,
    {
      path: path || "/shop/sofas/arbour-eco",
      version: "draft",
      language: language || "en",
    }
  );

  return { ...data };
}
