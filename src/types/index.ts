type AttributeStats = {
  count: number,
  total_count: number,
  rarity_percentage: number,
}

type Attribute = {
  trait_type: string,
  value: string,
}

type AttributeData = Attribute & AttributeStats;
type AttributeFilter = AttributeData & { isChecked: boolean };

type TokenData = {
  name: string,
  image: string,
  imageBlob?: Blob,
  attributes: AttributeData[],
}

type TokenDataWithRarity = (TokenData & {
  rarity_percentage: number,
  rank: number,
})


type CollectionSummary = {
  total_count: number,
  attribute_data_by_trait_type: { [trait_type: string]: AttributeData[] },
}

export {
  AttributeData,
  AttributeFilter,
  AttributeStats,
  Attribute,
  TokenData,
  TokenDataWithRarity,
  CollectionSummary
}