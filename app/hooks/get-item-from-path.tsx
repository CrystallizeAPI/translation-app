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
                  ... on ContentChunkContent {
                    chunks {
                      id
                      type
                      content {
                        ...componentsContent
                      }
                    }
                  }
                  ... on ComponentChoiceContent {
                    selectedComponent {
                      id
                      type
                      content {
                        ...componentsContent
                      }
                    }
                  }
                }
              }
            }
          }
          fragment componentsContent on ComponentContent {
            ... on SingleLineContent {
              text
            }
            ... on RichTextContent {
              json
              plainText
            }
            ... on ParagraphCollectionContent {
              paragraphs {
                title {
                  text
                }
                body {
                  json
                  plainText
                }
                images {
                  url
                  altText

                }
              }
            }
            ...on PropertiesTableContent {
              sections {
                title
                properties {
                  key
                  value
                }
              }
            }
            #file  title
            #video title
            #image altText
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
