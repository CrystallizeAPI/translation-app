export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Datetime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  _Any: { input: any; output: any; }
  _FieldSet: { input: any; output: any; }
};

export type BooleanContent = {
  __typename?: 'BooleanContent';
  value?: Maybe<Scalars['Boolean']['output']>;
};

export type Component = {
  __typename?: 'Component';
  content?: Maybe<ComponentContent>;
  id: Scalars['String']['output'];
  /** @deprecated meta properties on components are no longer supported and will be removed in a future release */
  meta?: Maybe<Array<MetaProperty>>;
  /** @deprecated meta properties on components are no longer supported and will be removed in a future release */
  metaProperty?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  type: ComponentType;
};


export type ComponentMetaPropertyArgs = {
  key: Scalars['String']['input'];
};

export type ComponentChoiceContent = {
  __typename?: 'ComponentChoiceContent';
  selectedComponent: Component;
};

export type ComponentContent = BooleanContent | ComponentChoiceContent | ContentChunkContent | DatetimeContent | FileContent | GridRelationsContent | ImageContent | ItemRelationsContent | LocationContent | NumericContent | ParagraphCollectionContent | PropertiesTableContent | RichTextContent | SelectionContent | SingleLineContent | VideoContent;

export enum ComponentType {
  Boolean = 'boolean',
  ComponentChoice = 'componentChoice',
  ContentChunk = 'contentChunk',
  Datetime = 'datetime',
  Files = 'files',
  GridRelations = 'gridRelations',
  Images = 'images',
  ItemRelations = 'itemRelations',
  Location = 'location',
  Numeric = 'numeric',
  ParagraphCollection = 'paragraphCollection',
  PropertiesTable = 'propertiesTable',
  RichText = 'richText',
  Selection = 'selection',
  SingleLine = 'singleLine',
  Videos = 'videos'
}

export type ContentChunkContent = {
  __typename?: 'ContentChunkContent';
  chunks: Array<Array<Component>>;
};


export type ContentChunkContentChunksArgs = {
  componentIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type DatetimeContent = {
  __typename?: 'DatetimeContent';
  datetime?: Maybe<Scalars['Datetime']['output']>;
};

export type Document = Item & {
  __typename?: 'Document';
  children?: Maybe<Array<Item>>;
  component?: Maybe<Component>;
  components?: Maybe<Array<Component>>;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  externalReference?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  language?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<Item>;
  path?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['Datetime']['output']>;
  relatingItems?: Maybe<Array<Item>>;
  shape: Shape;
  subtree: SubtreeConnection;
  topics?: Maybe<Array<Topic>>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  version: ItemVersion;
};


export type DocumentComponentArgs = {
  id: Scalars['String']['input'];
};


export type DocumentComponentsArgs = {
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type DocumentSubtreeArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<ItemSortField>;
};

export type File = {
  __typename?: 'File';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  key: Scalars['String']['output'];
  meta?: Maybe<Array<MetaProperty>>;
  metaProperty?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Float']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};


export type FileMetaPropertyArgs = {
  key: Scalars['String']['input'];
};

export type FileContent = {
  __typename?: 'FileContent';
  files?: Maybe<Array<File>>;
  firstFile?: Maybe<File>;
};

export type FocalPoint = {
  __typename?: 'FocalPoint';
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export type Folder = Item & {
  __typename?: 'Folder';
  children?: Maybe<Array<Item>>;
  component?: Maybe<Component>;
  components?: Maybe<Array<Component>>;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  externalReference?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  language?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<Item>;
  path?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['Datetime']['output']>;
  relatingItems?: Maybe<Array<Item>>;
  shape: Shape;
  subtree: SubtreeConnection;
  topics?: Maybe<Array<Topic>>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  version: ItemVersion;
};


export type FolderComponentArgs = {
  id: Scalars['String']['input'];
};


export type FolderComponentsArgs = {
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type FolderSubtreeArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<ItemSortField>;
};

export type Grid = {
  __typename?: 'Grid';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  dimensions?: Maybe<GridDimensions>;
  id: Scalars['ID']['output'];
  language: Scalars['String']['output'];
  meta?: Maybe<Array<MetaProperty>>;
  metaProperty?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  rows: Array<GridRow>;
};


export type GridMetaPropertyArgs = {
  key: Scalars['String']['input'];
};

export type GridColumn = {
  __typename?: 'GridColumn';
  item?: Maybe<Item>;
  itemId?: Maybe<Scalars['ID']['output']>;
  itemType?: Maybe<Scalars['String']['output']>;
  layout?: Maybe<GridColumnLayout>;
  meta?: Maybe<Array<MetaProperty>>;
  metaProperty?: Maybe<Scalars['String']['output']>;
};


export type GridColumnMetaPropertyArgs = {
  key: Scalars['String']['input'];
};

export type GridColumnLayout = {
  __typename?: 'GridColumnLayout';
  colIndex?: Maybe<Scalars['Int']['output']>;
  colspan?: Maybe<Scalars['Int']['output']>;
  rowIndex?: Maybe<Scalars['Int']['output']>;
  rowspan?: Maybe<Scalars['Int']['output']>;
};

export type GridDimensions = {
  __typename?: 'GridDimensions';
  columns?: Maybe<Scalars['Int']['output']>;
  rows?: Maybe<Scalars['Int']['output']>;
};

export type GridRelationsContent = {
  __typename?: 'GridRelationsContent';
  grids?: Maybe<Array<Grid>>;
};

export type GridRow = {
  __typename?: 'GridRow';
  columns: Array<GridColumn>;
  meta?: Maybe<Array<MetaProperty>>;
  metaProperty?: Maybe<Scalars['String']['output']>;
};


export type GridRowMetaPropertyArgs = {
  key: Scalars['String']['input'];
};

export type Image = {
  __typename?: 'Image';
  altText?: Maybe<Scalars['String']['output']>;
  caption?: Maybe<RichTextContent>;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  focalPoint?: Maybe<FocalPoint>;
  height?: Maybe<Scalars['Int']['output']>;
  key: Scalars['String']['output'];
  meta?: Maybe<Array<MetaProperty>>;
  metaProperty?: Maybe<Scalars['String']['output']>;
  topics?: Maybe<Array<Topic>>;
  url: Scalars['String']['output'];
  variants?: Maybe<Array<ImageVariant>>;
  width?: Maybe<Scalars['Int']['output']>;
};


export type ImageMetaPropertyArgs = {
  key: Scalars['String']['input'];
};


export type ImageTopicsArgs = {
  language: Scalars['String']['input'];
};

export type ImageConnection = {
  __typename?: 'ImageConnection';
  edges?: Maybe<Array<ImageEdge>>;
  pageInfo: PageInfo;
};

export type ImageContent = {
  __typename?: 'ImageContent';
  firstImage?: Maybe<Image>;
  images?: Maybe<Array<Image>>;
};

export type ImageEdge = {
  __typename?: 'ImageEdge';
  cursor: Scalars['String']['output'];
  node: Image;
};

export type ImageFilterInput = {
  topicPaths?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ImageVariant = {
  __typename?: 'ImageVariant';
  height?: Maybe<Scalars['Int']['output']>;
  key: Scalars['String']['output'];
  size?: Maybe<Scalars['Int']['output']>;
  url: Scalars['String']['output'];
  width: Scalars['Int']['output'];
};

export type Item = {
  children?: Maybe<Array<Item>>;
  component?: Maybe<Component>;
  components?: Maybe<Array<Component>>;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  externalReference?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  language?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<Item>;
  path?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['Datetime']['output']>;
  relatingItems?: Maybe<Array<Item>>;
  shape: Shape;
  subtree: SubtreeConnection;
  topics?: Maybe<Array<Topic>>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  version: ItemVersion;
};


export type ItemComponentArgs = {
  id: Scalars['String']['input'];
};


export type ItemComponentsArgs = {
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type ItemSubtreeArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<ItemSortField>;
};

export type ItemRelationsContent = {
  __typename?: 'ItemRelationsContent';
  items?: Maybe<Array<Item>>;
  productVariants?: Maybe<Array<ProductVariant>>;
};


export type ItemRelationsContentItemsArgs = {
  version?: InputMaybe<VersionLabel>;
};


export type ItemRelationsContentProductVariantsArgs = {
  version?: InputMaybe<VersionLabel>;
};

export enum ItemSortField {
  TreePosition = 'treePosition'
}

export type ItemVersion = {
  __typename?: 'ItemVersion';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['ID']['output'];
  label: VersionLabel;
};

export type KeyValuePair = {
  __typename?: 'KeyValuePair';
  key: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type LocationContent = {
  __typename?: 'LocationContent';
  lat?: Maybe<Scalars['Float']['output']>;
  long?: Maybe<Scalars['Float']['output']>;
};

export type MetaProperty = {
  __typename?: 'MetaProperty';
  key: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type NumericContent = {
  __typename?: 'NumericContent';
  number: Scalars['Float']['output'];
  unit?: Maybe<Scalars['String']['output']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Scalars['String']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor: Scalars['String']['output'];
  totalNodes: Scalars['Int']['output'];
};

export type ParagraphCollectionContent = {
  __typename?: 'ParagraphCollectionContent';
  paragraphs?: Maybe<Array<ParagraphContent>>;
};

export type ParagraphContent = {
  __typename?: 'ParagraphContent';
  body?: Maybe<RichTextContent>;
  images?: Maybe<Array<Image>>;
  title?: Maybe<SingleLineContent>;
  videos?: Maybe<Array<Video>>;
};

export type PriceList = {
  __typename?: 'PriceList';
  identifier: Scalars['String']['output'];
  modifierType: PriceListModifierType;
  name: Scalars['String']['output'];
  productVariants: ProductVariantConnection;
  products?: Maybe<ProductConnection>;
  tenantId: Scalars['ID']['output'];
};


export type PriceListProductVariantsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  language: Scalars['String']['input'];
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type PriceListProductsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  language: Scalars['String']['input'];
  last?: InputMaybe<Scalars['Int']['input']>;
};

export enum PriceListModifierType {
  Absolute = 'ABSOLUTE',
  Percentage = 'PERCENTAGE',
  Relative = 'RELATIVE'
}

export type Product = Item & {
  __typename?: 'Product';
  children?: Maybe<Array<Item>>;
  component?: Maybe<Component>;
  components?: Maybe<Array<Component>>;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  defaultVariant?: Maybe<ProductVariant>;
  externalReference?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** @deprecated option removed */
  isSubscriptionOnly?: Maybe<Scalars['Boolean']['output']>;
  /** @deprecated option removed */
  isVirtual?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<Item>;
  path?: Maybe<Scalars['String']['output']>;
  publishedAt?: Maybe<Scalars['Datetime']['output']>;
  relatingItems?: Maybe<Array<Item>>;
  shape: Shape;
  subtree: SubtreeConnection;
  topics?: Maybe<Array<Topic>>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  variants?: Maybe<Array<ProductVariant>>;
  vatType?: Maybe<VatInfo>;
  version: ItemVersion;
};


export type ProductComponentArgs = {
  id: Scalars['String']['input'];
};


export type ProductComponentsArgs = {
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type ProductSubtreeArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<ItemSortField>;
};

export type ProductConnection = {
  __typename?: 'ProductConnection';
  edges?: Maybe<Array<ProductConnectionEdge>>;
  pageInfo: PageInfo;
};

export type ProductConnectionEdge = {
  __typename?: 'ProductConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Product;
};

export type ProductPriceVariant = {
  __typename?: 'ProductPriceVariant';
  currency?: Maybe<Scalars['String']['output']>;
  identifier: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  priceFor: ProductVariantPriceList;
  priceForEveryone: ProductVariantPriceList;
  priceList?: Maybe<ProductVariantPriceList>;
};


export type ProductPriceVariantPriceForArgs = {
  marketIdentifiers: Array<Scalars['String']['input']>;
};


export type ProductPriceVariantPriceListArgs = {
  identifier: Scalars['String']['input'];
};

export type ProductStockLocation = {
  __typename?: 'ProductStockLocation';
  identifier: Scalars['String']['output'];
  meta?: Maybe<Array<KeyValuePair>>;
  name: Scalars['String']['output'];
  stock?: Maybe<Scalars['Int']['output']>;
};

export type ProductVariant = {
  __typename?: 'ProductVariant';
  attributes?: Maybe<Array<Maybe<ProductVariantAttribute>>>;
  component?: Maybe<Component>;
  components?: Maybe<Array<Component>>;
  externalReference?: Maybe<Scalars['String']['output']>;
  firstImage?: Maybe<Image>;
  /** @deprecated Product variant IDs have been deprecated and replaced by SKUs. */
  id: Scalars['ID']['output'];
  /** @deprecated The `image` property is deprecated and will be removed in a future release. Use the `images` property instead. */
  image?: Maybe<Image>;
  images?: Maybe<Array<Image>>;
  isDefault?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  priceVariant?: Maybe<ProductPriceVariant>;
  priceVariants?: Maybe<Array<ProductPriceVariant>>;
  product?: Maybe<Product>;
  sku: Scalars['String']['output'];
  stock?: Maybe<Scalars['Int']['output']>;
  stockLocations?: Maybe<Array<ProductStockLocation>>;
  subscriptionPlans?: Maybe<Array<ProductVariantSubscriptionPlan>>;
  videos?: Maybe<Array<Video>>;
};


export type ProductVariantComponentArgs = {
  id: Scalars['String']['input'];
};


export type ProductVariantComponentsArgs = {
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type ProductVariantPriceArgs = {
  identifier?: InputMaybe<Scalars['String']['input']>;
};


export type ProductVariantPriceVariantArgs = {
  identifier: Scalars['String']['input'];
};


export type ProductVariantStockArgs = {
  identifier?: InputMaybe<Scalars['String']['input']>;
};

export type ProductVariantAttribute = {
  __typename?: 'ProductVariantAttribute';
  attribute: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type ProductVariantConnection = {
  __typename?: 'ProductVariantConnection';
  edges?: Maybe<Array<ProductVariantConnectionEdge>>;
  pageInfo: PageInfo;
};

export type ProductVariantConnectionEdge = {
  __typename?: 'ProductVariantConnectionEdge';
  cursor: Scalars['String']['output'];
  node: ProductVariant;
};

export type ProductVariantPriceList = {
  __typename?: 'ProductVariantPriceList';
  endDate?: Maybe<Scalars['Datetime']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  modifier?: Maybe<Scalars['Float']['output']>;
  modifierType?: Maybe<PriceListModifierType>;
  price?: Maybe<Scalars['Float']['output']>;
  startDate?: Maybe<Scalars['Datetime']['output']>;
};

export type ProductVariantSubscriptionMeteredVariable = {
  __typename?: 'ProductVariantSubscriptionMeteredVariable';
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  name: Scalars['String']['output'];
  tierType: TierType;
  tiers: Array<ProductVariantSubscriptionPlanTier>;
};

export type ProductVariantSubscriptionPlan = {
  __typename?: 'ProductVariantSubscriptionPlan';
  identifier: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  periods: Array<ProductVariantSubscriptionPlanPeriod>;
};

export type ProductVariantSubscriptionPlanPeriod = {
  __typename?: 'ProductVariantSubscriptionPlanPeriod';
  id: Scalars['ID']['output'];
  initial?: Maybe<ProductVariantSubscriptionPlanPricing>;
  name: Scalars['String']['output'];
  recurring?: Maybe<ProductVariantSubscriptionPlanPricing>;
};

export type ProductVariantSubscriptionPlanPricing = {
  __typename?: 'ProductVariantSubscriptionPlanPricing';
  meteredVariables?: Maybe<Array<ProductVariantSubscriptionMeteredVariable>>;
  period: Scalars['Int']['output'];
  price?: Maybe<Scalars['Float']['output']>;
  priceVariants?: Maybe<Array<ProductPriceVariant>>;
  unit: SubscriptionPeriodUnit;
};


export type ProductVariantSubscriptionPlanPricingPriceArgs = {
  identifier?: InputMaybe<Scalars['String']['input']>;
};

export type ProductVariantSubscriptionPlanTier = {
  __typename?: 'ProductVariantSubscriptionPlanTier';
  price?: Maybe<Scalars['Float']['output']>;
  priceVariants?: Maybe<Array<ProductPriceVariant>>;
  threshold: Scalars['Int']['output'];
};


export type ProductVariantSubscriptionPlanTierPriceArgs = {
  identifier?: InputMaybe<Scalars['String']['input']>;
};

export type PropertiesTableContent = {
  __typename?: 'PropertiesTableContent';
  sections?: Maybe<Array<PropertiesTableSection>>;
};

export type PropertiesTableSection = {
  __typename?: 'PropertiesTableSection';
  properties?: Maybe<Array<PropertiesTableValue>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type PropertiesTableValue = {
  __typename?: 'PropertiesTableValue';
  key: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  catalogue?: Maybe<Item>;
  grid?: Maybe<Grid>;
  image?: Maybe<Image>;
  images: ImageConnection;
  /** **EXPERIMENTAL:** Watch out! This feature is still in testing process. */
  priceList?: Maybe<PriceList>;
  tenant?: Maybe<Tenant>;
  topic?: Maybe<Topic>;
  topics: Array<Topic>;
  /** @deprecated `tree` query is deprecated and will be removed in a future release. Use the `catalogue` query instead. */
  tree?: Maybe<Array<Maybe<Item>>>;
  version?: Maybe<VersionInfo>;
};


export type QueryCatalogueArgs = {
  language?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<VersionLabel>;
};


export type QueryGridArgs = {
  id: Scalars['ID']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
};


export type QueryImageArgs = {
  key: Scalars['String']['input'];
  language: Scalars['String']['input'];
};


export type QueryImagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ImageFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  language: Scalars['String']['input'];
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPriceListArgs = {
  identifier: Scalars['String']['input'];
};


export type QueryTenantArgs = {
  language?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTopicArgs = {
  language: Scalars['String']['input'];
  path: Scalars['String']['input'];
};


export type QueryTopicsArgs = {
  ancestry?: InputMaybe<Array<Scalars['String']['input']>>;
  language?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTreeArgs = {
  language?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
};

export type RichTextContent = {
  __typename?: 'RichTextContent';
  html?: Maybe<Array<Scalars['String']['output']>>;
  json?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  plainText?: Maybe<Array<Scalars['String']['output']>>;
};

export type SelectionComponentOption = {
  __typename?: 'SelectionComponentOption';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type SelectionContent = {
  __typename?: 'SelectionContent';
  options?: Maybe<Array<SelectionComponentOption>>;
};

export type Shape = {
  __typename?: 'Shape';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  /** @deprecated Shape ids have been deprecated in favor of human readable identifiers and will be removed in a future release. */
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  meta?: Maybe<Array<MetaProperty>>;
  metaProperty?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};


export type ShapeMetaPropertyArgs = {
  key: Scalars['String']['input'];
};

export type SingleLineContent = {
  __typename?: 'SingleLineContent';
  text?: Maybe<Scalars['String']['output']>;
};

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export enum SubscriptionPeriodUnit {
  Day = 'day',
  Month = 'month',
  Week = 'week',
  Year = 'year'
}

export type SubtreeConnection = {
  __typename?: 'SubtreeConnection';
  edges?: Maybe<Array<SubtreeEdge>>;
  pageInfo: PageInfo;
};

export type SubtreeEdge = {
  __typename?: 'SubtreeEdge';
  cursor: Scalars['String']['output'];
  node: Item;
};

export type TargetAudienceInput = {
  customerIdentifier?: InputMaybe<Scalars['String']['input']>;
  marketIdentifier?: InputMaybe<Scalars['String']['input']>;
  type: TargetAudienceType;
};

export enum TargetAudienceType {
  Everyone = 'EVERYONE',
  Some = 'SOME'
}

export type Tenant = {
  __typename?: 'Tenant';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  defaults?: Maybe<TenantDefaults>;
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  isTrial?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<Image>;
  name?: Maybe<Scalars['String']['output']>;
};

export type TenantDefaults = {
  __typename?: 'TenantDefaults';
  currency?: Maybe<Scalars['String']['output']>;
  language?: Maybe<Scalars['String']['output']>;
};

export enum TierType {
  Graduated = 'graduated',
  Volume = 'volume'
}

export type Topic = {
  __typename?: 'Topic';
  childCount: Scalars['Int']['output'];
  children?: Maybe<Array<Topic>>;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['ID']['output'];
  images: TopicImageConnection;
  items: TopicItemConnection;
  language?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  parent?: Maybe<Topic>;
  parentId?: Maybe<Scalars['ID']['output']>;
  path: Scalars['String']['output'];
};


export type TopicImagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  language: Scalars['String']['input'];
  last?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<TopicImageSortField>;
};


export type TopicItemsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<TopicItemSortField>;
};

export type TopicImageConnection = {
  __typename?: 'TopicImageConnection';
  edges?: Maybe<Array<TopicImageEdge>>;
  pageInfo: PageInfo;
};

export type TopicImageEdge = {
  __typename?: 'TopicImageEdge';
  cursor: Scalars['String']['output'];
  node: Image;
};

export enum TopicImageSortField {
  CreatedAt = 'createdAt'
}

export type TopicItemConnection = {
  __typename?: 'TopicItemConnection';
  edges?: Maybe<Array<TopicItemEdge>>;
  pageInfo: PageInfo;
};

export type TopicItemEdge = {
  __typename?: 'TopicItemEdge';
  cursor: Scalars['String']['output'];
  node: Item;
};

export enum TopicItemSortField {
  CreatedAt = 'createdAt'
}

export type VatInfo = {
  __typename?: 'VatInfo';
  name?: Maybe<Scalars['String']['output']>;
  percent?: Maybe<Scalars['Float']['output']>;
};

export type VersionInfo = {
  __typename?: 'VersionInfo';
  apiVersion: Scalars['String']['output'];
  commitSha: Scalars['String']['output'];
};

export enum VersionLabel {
  Draft = 'draft',
  Published = 'published'
}

export type Video = {
  __typename?: 'Video';
  id: Scalars['String']['output'];
  playlist?: Maybe<Scalars['String']['output']>;
  playlists?: Maybe<Array<Scalars['String']['output']>>;
  thumbnails?: Maybe<Array<Image>>;
  title?: Maybe<Scalars['String']['output']>;
};


export type VideoPlaylistArgs = {
  type: Scalars['String']['input'];
};

export type VideoContent = {
  __typename?: 'VideoContent';
  firstVideo?: Maybe<Video>;
  videos?: Maybe<Array<Video>>;
};

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']['output']>;
};
