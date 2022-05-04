import localForage from "localforage";
import _ from "lodash";
import { RootState } from "../_reducers";

export const loadState = async (): Promise<RootState | undefined> => {
  try {
    const serializedState: RootState | null = await localForage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    const tokens = serializedState.tokens.map((token) => {
      return {
        ...token,
        image: URL.createObjectURL(token!.imageBlob!),
      };
    });
    const state = {
      ...serializedState,
      attributeSearchFiltersByTraitType: _(serializedState.collectionSummary!.attribute_data_by_trait_type)
                .mapValues((attributeData) => {
                  return attributeData.map((attributeData: any) => {
                    return {
                      ...attributeData,
                      isChecked: false
                    }
                  })
                })
                .value(),
      tokens,
      filteredTokens: tokens
    }
    return state;
  } catch (err) {
    return undefined;
  }
}; 

export const saveState = (state: any) => {
  try {
    localForage.setItem('state', state);
  } catch {
    // ignore write errors
  }
};