import { apiClient } from "../shared";
import type { Query } from "~/__generated__/types";

export async function getItemFromPath(path: string, language: string) {
  const data = await apiClient.catalogueApi(
    `#graphql
          query GET_COMPONENTS($path: String!, $version: VersionLabel, $language: String!) {
            catalogue(path: $path, language: $language, version:$version) {
              id
              name
              path
              ... on Product {
                variants {
                  id
                  name
                  sku
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
                  key
                }
              }
            }
            ... on ComponentChoiceContent {
              selectedComponent {
                id
                type
                content {
                  ...on SingleLineContent {
                    text
                  }
                  ...on RichTextContent {
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
                          key
                        }
                      }
                    }
                }
              }
            }
            ... on ContentChunkContent {
                chunks {
                  id
                  type
                  content {
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
                          key
                        }
                      }
                    }
                    ... on ImageContent {
                        images {
                            url
                            altText
                            key
                        }
                    }
                  }
                }
             }
          }
        `,
    {
      path: path || "/superb-product",
      version: "draft",
      language: language || "en",
    }
  );

  return data as Pick<Query, "catalogue">;
}
