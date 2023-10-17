import { apiClient } from "../shared";

export async function getItemFromPath(path: string, language: string) {
  const data = await apiClient.catalogueApi(
    `#graphql
          query ($path: String!, $version: VersionLabel, $language: String!) {
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
  let product = {};
  let variants = {};

  data.catalogue.components.map((a) => {
    product[a.id] = { ...a, translation: null };
    if (a.type === "contentChunk") {
      product[a.id].content = {};
      a.content.chunks?.map((c, i) => {
        product[a.id].content[`${a.id}-#${i}`] = {};
        c.map((chunkCmp) => {
          product[a.id].content[`${a.id}-#${i}`][chunkCmp.id] = {
            ...chunkCmp,
            translation: null,
          };
        });
      });
    }
  });

  data.catalogue.variants.map((variant) => {
    variants[variant.sku] = {};
    variant.components.map((cmp) => {
      variants[variant.sku][cmp.id] = { content: cmp, translation: null };

      if (cmp.type === "contentChunk") {
        cmp.content.chunks?.map((chunk, i) => {
          variants[variant.sku][cmp.id][`${chunk.id}-#${i}`] = {};
          chunk.map((c) => {
            variants[variant.sku][cmp.id][`${chunk.id}-#${i}`][chunk.id] = {
              ...c,
              translation: null,
            };
          });
        });
      }
    });
  });
  console.log({ variants });
  console.log({ product });

  return { ...data, stories: { product, variants } };
}

const storiesDummy = {
  product: {
    "cmp-1": {},
    "cmp-2": {},
    chunk: {
      "chunk-1": {
        title: {},
        description: {},
      },
      "chunk-2": {
        title: {},
        description: {},
      },
    },
  },
};
