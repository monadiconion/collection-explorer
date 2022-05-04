import { AnyAction } from 'redux';
import { AttributeFilter, CollectionSummary, TokenDataWithRarity } from '../types';
import { constants } from '../_actions';

enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}
interface RootState {
  attributeSearchFiltersByTraitType: { [trait_type: string]: AttributeFilter[] }
  isLoading: boolean;
  tokensSortOrder: SortOrder;
  tokens: TokenDataWithRarity[],
  filteredTokens: TokenDataWithRarity[],
  collectionSummary: CollectionSummary | null
}

const initialState: RootState = {
  attributeSearchFiltersByTraitType: {},
  isLoading: false,
  tokensSortOrder: SortOrder.desc,
  tokens: [],
  filteredTokens: [],
  collectionSummary: null
}

// Use the initialState as a default value
export default function appReducer(state = initialState, action: AnyAction) {
  // The reducer normally looks at the action type field to decide what happens
  switch (action.type) {
    case constants.INITIALIZE_STATE:
      return {
        ...state,
        ...action.payload
      }
    case constants.SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    case constants.SET_TOKENS:
      return {
        ...state,
        tokens: action.payload
      }
    case constants.SET_FILTERED_TOKENS:
      return {
        ...state,
        filteredTokens: action.payload
      }
    case constants.SET_COLLECTION_SUMMARY:
      return {
        ...state,
        collectionSummary: action.payload
      }
    case constants.SET_ATTRIBUTE_FILTER:
      const prevAttributeSearchFiltersByTraitType = state.attributeSearchFiltersByTraitType;
      let targetFilterIndex = state.attributeSearchFiltersByTraitType[action.payload.trait_type].findIndex((attributeFilter) => attributeFilter.value === action.payload.value)

      const attributeSearchFiltersByTraitType = {
        ...prevAttributeSearchFiltersByTraitType,
        [action.payload.trait_type]: [
          ...prevAttributeSearchFiltersByTraitType[action.payload.trait_type].slice(0, targetFilterIndex),
          {
            ...prevAttributeSearchFiltersByTraitType[action.payload.trait_type][targetFilterIndex],
            isChecked: action.payload.isChecked
          },
          ...prevAttributeSearchFiltersByTraitType[action.payload.trait_type].slice(targetFilterIndex + 1)
        ]
      }

      return {
        ...state,
        attributeSearchFiltersByTraitType,
      }
    case constants.SET_ATTRIBUTE_FILTERS_BY_TRAIT_TYPE:
      return {
        ...state,
        attributeSearchFiltersByTraitType: action.payload
      }
    case constants.SET_TOKENS_SORT_ORDER:
      return {
        ...state,
        tokensSortOrder: action.payload,
        filteredTokens: state.filteredTokens?.sort((a, b) => {
          if (state.tokensSortOrder === 'asc') {
            return a.rank - b.rank;
          } else {
            return b.rank - a.rank;
          }
        })
      }
    default:
      return state
  }
}

export {
  RootState
};