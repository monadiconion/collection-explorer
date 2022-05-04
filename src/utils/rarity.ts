import _ from 'lodash';

import {
  Attribute,
  TokenData,
  TokenDataWithRarity,
  CollectionSummary,
  AttributeData
} from '../types';

const formatPercentage = (percentage: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(percentage);

function getCollectionSummary(metadata: any): CollectionSummary {
  const totalCount = metadata.length;
  const attributesByTraitType = _(metadata)
    .map((token: TokenData) => token.attributes)
    .flatten()
    .groupBy('trait_type')
    .value();
  const attributesDataByTraitType: any
    = _(attributesByTraitType)
      .mapValues((attributes: Attribute[]) => {
        const totalCount = attributes.length;
        const countByAttributeValue = _.countBy(attributes, 'value');
        return _(countByAttributeValue)
          .keys()
          .map((value: string) => {
            return {
              trait_type: attributes[0].trait_type,
              value,
              count: countByAttributeValue[value],
              total_count: totalCount,
              rarity_percentage: Number(formatPercentage(countByAttributeValue[value] / totalCount * 100))
            };
          })
          .orderBy('rarity_percentage', 'desc')
          .value();
      })
      .value();


  return {
    total_count: totalCount,
    attribute_data_by_trait_type: attributesDataByTraitType
  }
}

function enrichWithTokensRarity(metadata: any, collectionSummary: CollectionSummary): TokenDataWithRarity[] {
  const enrichAttributeWithRarity = (attribute: Attribute) => {
    const attributeData = collectionSummary.attribute_data_by_trait_type[attribute.trait_type].find((attributeData: AttributeData) => attributeData.value === attribute.value);
    return {
      ...attribute,
      count: attributeData!.count,
      total_count: attributeData!.total_count,
      rarity_percentage: attributeData!.rarity_percentage
    }
  }
  const tokensWithRarity = metadata.map((token: TokenData) => {
    const rarityLogProb = _(token.attributes)
      .map((attribute: Attribute) => {
        const attributeData = _.find(collectionSummary.attribute_data_by_trait_type[attribute.trait_type], { value: attribute.value });
        return Math.log10(attributeData!.rarity_percentage / 100);
      })
      .sum();


    return {
      ...token,
      attributes: token.attributes.map(enrichAttributeWithRarity).sort((a: AttributeData, b: AttributeData) => a.rarity_percentage - b.rarity_percentage),
      rarity_percentage: Math.pow(10, rarityLogProb) * 100
    };
  });

  const tokensWithRaritySorted = _.orderBy(tokensWithRarity, ['rarity_percentage'], ['asc'])
    .map((token: TokenDataWithRarity, i: number) => {
      return {
        ...token,
        rank: i + 1
      };
    });

  return tokensWithRaritySorted;
}

export {
  getCollectionSummary,
  enrichWithTokensRarity
}
