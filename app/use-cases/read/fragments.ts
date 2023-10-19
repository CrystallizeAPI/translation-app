export const Item = `
  fragment Item on Item {
    id
    name
    shape {
      identifier
      name
    }
    type

    ... on Product {
      defaultVariant {
        images {
          url
          variants {
            width
            url
          }
        }
      }
    }

    ... on Folder {
      components {
        content {
          ... on ImageContent {
            images {
              url
              variants {
                width
                url
              }
            }
          }
        }
      }
    }

    ... on Document {
      components {
        content {
          ... on ImageContent {
            images {
              url
              variants {
                width
                url
              }
            }
          }
        }
      }
    }
  }
`;

const Image = `
  fragment Image on Image {
    altText
    caption {
      json
    }
    key
    meta {
      key
      value
    }
    url
    variants {
      key
      width
      height
      url
    }
  }
`;

const Video = `
  fragment Video on Video {
    id
    title
    thumbnails {
      ...Image
    }
    playlists
  }
`;

const BooleanContent = `
  fragment BooleanContent on BooleanContent {
    value
  }
`;

const ComponentChoiceContent = `
  fragment ComponentChoiceContent on ComponentChoiceContent {
    selectedComponent {
      componentId
      content {
        ... on BooleanContent {
          ...BooleanContent
        }
        ... on DatetimeContent {
          ...DatetimeContent
        }
        ... on FileContent {
          ...FileContent
        }
        ... on GridRelationsContent {
          ...GridRelationsContent
        }
        ... on ImageContent {
          ...ImageContent
        }
        ... on ItemRelationsContent {
          ...ItemRelationsContent
        }
        ... on LocationContent {
          ...LocationContent
        }
        ... on NumericContent {
          ...NumericContent
        }
        ... on ParagraphCollectionContent {
          ...ParagraphCollectionContent
        }
        ... on PropertiesTableContent {
          ...PropertiesTableContent
        }
        ... on RichTextContent {
          ...RichTextContent
        }
        ... on SelectionContent {
          ...SelectionContent
        }
        ... on SingleLineContent {
          ...SingleLineContent
        }
        ... on VideoContent {
          ...VideoContent
        }
      }
      name
      type
    }
  }
`;

const ContentChunkContent = `
  fragment ContentChunkContent on ContentChunkContent {
    chunks {
      componentId
      content {
        ... on BooleanContent {
          ...BooleanContent
        }
        ... on DatetimeContent {
          ...DatetimeContent
        }
        ... on FileContent {
          ...FileContent
        }
        ... on GridRelationsContent {
          ...GridRelationsContent
        }
        ... on ImageContent {
          ...ImageContent
        }
        ... on ItemRelationsContent {
          ...ItemRelationsContent
        }
        ... on LocationContent {
          ...LocationContent
        }
        ... on NumericContent {
          ...NumericContent
        }
        ... on ParagraphCollectionContent {
          ...ParagraphCollectionContent
        }
        ... on PropertiesTableContent {
          ...PropertiesTableContent
        }
        ... on RichTextContent {
          ...RichTextContent
        }
        ... on SelectionContent {
          ...SelectionContent
        }
        ... on SingleLineContent {
          ...SingleLineContent
        }
        ... on VideoContent {
          ...VideoContent
        }
      }
      name
      type
    }
  }
`;

const DatetimeContent = `
  fragment DatetimeContent on DatetimeContent {
    datetime
  }
`;

const FileContent = `
  fragment FileContent on FileContent {
    files {
      contentType
      key
      size
      title
      url
    }
  }
`;

const GridRelationsContent = `
  fragment GridRelationsContent on GridRelationsContent {
    grids {
      id
      name
    }
  }
`;

const ImageContent = `
  fragment ImageContent on ImageContent {
    images {
      ...Image
    }
  }
  ${Image}
`;

const ItemRelationsContent = `
  fragment ItemRelationsContent on ItemRelationsContent {
    items {
      ...Item
    }
  }
  ${Item}
`;

const LocationContent = `
  fragment LocationContent on LocationContent {
    lat
    long
  }
`;

const NumericContent = `
  fragment NumericContent on NumericContent {
    number
    unit
  }
`;

const ParagraphCollectionContent = `
  fragment ParagraphCollectionContent on ParagraphCollectionContent {
    paragraphs {
      title {
        text
      }
      body {
        plainText
      }
      images {
        ...Image
      }
      videos {
        ...Video
      }
    }
  }
`;

const PropertiesTableContent = `
  fragment PropertiesTableContent on PropertiesTableContent {
    sections {
      title
      properties {
        key
        value
      }
    }
  }
`;

const RichTextContent = `
  fragment RichTextContent on RichTextContent {
    plainText
  }
`;

const SelectionContent = `
  fragment SelectionContent on SelectionContent {
    options {
      key
      value
    }
  }
`;

const SingleLineContent = `
  fragment SingleLineContent on SingleLineContent {
    text
  }
`;

const VideoContent = `
  fragment VideoContent on VideoContent {
    videos {
      ...Video
    }
  }
  ${Video}
`;

export const Component = `
  fragment Component on Component {
    componentId
    content {
      ... on ComponentChoiceContent {
        ...ComponentChoiceContent
      }
      ... on ContentChunkContent {
        ...ContentChunkContent
      }
      ... on ParagraphCollectionContent {
        ...ParagraphCollectionContent
      }
      ... on RichTextContent {
        ...RichTextContent
      }
      ... on SingleLineContent {
        ...SingleLineContent
      }
    }
    name
    type
  }
  ${BooleanContent}
  ${ComponentChoiceContent}
  ${ContentChunkContent}
  ${DatetimeContent}
  ${FileContent}
  ${GridRelationsContent}
  ${ImageContent}
  ${ItemRelationsContent}
  ${LocationContent}
  ${NumericContent}
  ${ParagraphCollectionContent}
  ${PropertiesTableContent}
  ${RichTextContent}
  ${SelectionContent}
  ${SingleLineContent}
  ${VideoContent}
`;
