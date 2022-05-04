import JSZip from "jszip";
import _ from "lodash";
import { AttributeFilter } from "../types";
import { loadState } from "../utils/localstorage";
import { getCollectionSummary, enrichWithTokensRarity } from "../utils/rarity";
import { RootState } from '../_reducers';
const constants = {
  INITIALIZE_STATE: 'INITIALIZE_STATE',
  SET_IS_LOADING: 'SET_IS_LOADING',
  SET_ATTRIBUTE_FILTERS_BY_TRAIT_TYPE: 'SET_ATTRIBUTE_FILTERS_BY_TRAIT_TYPE',
  SET_ATTRIBUTE_FILTER: 'SET_ATTRIBUTE_FILTER',
  SET_COLLECTION_SUMMARY: 'SET_COLLECTION_SUMMARY',
  SET_TOKENS: 'SET_TOKENS',
  SET_FILTERED_TOKENS: 'SET_FILTERED_TOKENS',
  SET_TOKENS_SORT_ORDER: 'SET_TOKENS_SORT_ORDER',
}

function initializeState() {
  return async (dispatch: any) => {
    dispatch({ type: constants.SET_IS_LOADING, payload: true });
    const initialState = await loadState();
    if (initialState) {
      dispatch({
        type: constants.INITIALIZE_STATE,
        payload: initialState
      })
    }
    dispatch({ type: constants.SET_IS_LOADING, payload: false });
  }
}

function setAttributeFilter(trait_type: string, value: string, isChecked: boolean) {
  return async (dispatch: any, getState: any) => {
    dispatch({ 
      type: constants.SET_ATTRIBUTE_FILTER, 
      payload: { 
        isChecked,
        trait_type,
        value
      } 
    });
    const state: RootState = getState();
    const tokens = state.tokens;
    const attributeFilters = _(state.attributeSearchFiltersByTraitType)
                              .values()
                              .flatten()
                              .filter((attributeFilter: AttributeFilter) => attributeFilter.isChecked)
                              .value();
    
    if (attributeFilters.length === 0) {
      dispatch({
        type: constants.SET_FILTERED_TOKENS,
        payload: tokens
      });
      return;
    }
    const filteredTokens = tokens.filter((token) => {
      return token.attributes.some((attribute) => {
        return attributeFilters.some((attributeFilter: AttributeFilter) => {
          return attributeFilter.trait_type === attribute.trait_type && attributeFilter.value === attribute.value;
        });
      })
    });


    dispatch({
      type: constants.SET_FILTERED_TOKENS,
      payload: filteredTokens
    });
    
  }
}

function extractZipFile(zipFile: File) {
  return async (dispatch: any) => {
    dispatch({ type: constants.SET_IS_LOADING, payload: true });
    const zip = await JSZip.loadAsync(zipFile);
    const fileEntries = Object.keys(zip.files).map((name) => zip.files[name]);
    const metadataEntry = fileEntries.filter((file) =>
      file.name.includes("metadata")
    )[0];
    const imageEntries = fileEntries.filter((file) =>
      file.name.endsWith(".png")
    );

    const metadataFile = await metadataEntry.async("blob");
    let metadata = JSON.parse(await new Response(metadataFile).text());
    const imageURLs = await Promise.all(
      imageEntries.map(async (file) => {
        return {
          edition: Number(file.name.split(".")[0].split("images/")[1]),
          blob: await file.async("blob"),
        };
      })
    );

    metadata = metadata.map((token: any) => {
      return {
        ...token,
        imageBlob: imageURLs.find((image) => image.edition === token.edition)!.blob,
        image: URL.createObjectURL(imageURLs.find((image) => image.edition === token.edition)!.blob),
      };
    });

    const collectionSummary = getCollectionSummary(metadata);

    dispatch({ 
      type: constants.SET_COLLECTION_SUMMARY,
      payload: collectionSummary
    });

    dispatch({
      type: constants.SET_ATTRIBUTE_FILTERS_BY_TRAIT_TYPE,
      payload: _(collectionSummary.attribute_data_by_trait_type)
                .mapValues((attributeData) => {
                  return attributeData.map((attributeData: any) => {
                    return {
                      ...attributeData,
                      isChecked: false
                    }
                  })
                })
                .value()
    });
    
    const tokens = enrichWithTokensRarity(metadata, collectionSummary);
    dispatch({ 
      type: constants.SET_TOKENS,
      payload: tokens
    });
    dispatch({ 
      type: constants.SET_FILTERED_TOKENS,
      payload: tokens
    });
    dispatch({ 
      type: constants.SET_IS_LOADING,
      payload: false 
    });
  }
}

export {
  constants,
  initializeState,
  extractZipFile,
  setAttributeFilter
}