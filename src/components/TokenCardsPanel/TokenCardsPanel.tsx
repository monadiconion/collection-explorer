import { Button, Grid, Stack, Box, Chip } from "@mui/material";
import React, { FC, useState } from "react";
import TokenCard from "../TokenCard/TokenCard";
import styles from "./TokenCardsPanel.module.css";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_reducers";
import { DensityLarge, DensitySmall } from "@mui/icons-material";
import { FixedSizeGrid, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { AttributeFilter } from "../../types";
import { setAttributeFilter } from "../../_actions";

const ActiveFilters = () => {
  const dispatch = useDispatch();

  const activeFilters = useSelector((state: RootState) =>
    Object.values(state.attributeSearchFiltersByTraitType)
      .flat()
      .filter((filter) => filter.isChecked)
  );

  const handleDelete = (filter: AttributeFilter) => {
    dispatch(setAttributeFilter(filter.trait_type, filter.value, false));
  };

  const filters = activeFilters.map((filter: AttributeFilter) => (
    <Chip
      key={`${filter.trait_type}-${filter.value}`}
      size="small"
      label={filter.trait_type + "/" + filter.value}
      onDelete={() => handleDelete(filter)}
    />
  ));
  return <div>{filters}</div>;
};

interface TokenCardsPanelProps {}

const TokenCardsPanel: FC<TokenCardsPanelProps> = (props) => {
  const [isCompactMode, setIsCompactMode] = useState(true);
  const tokensSortOrder = useSelector(
    (state: RootState) => state.tokensSortOrder
  );
  const tokens = useSelector((state: RootState) => state.filteredTokens);
  const dispatch = useDispatch();

  const TokenRenderer = React.memo(
    ({ data, columnIndex, rowIndex, style }: any) => {
      return (
        <div style={style}>
          {tokens[rowIndex * data.columnCount + columnIndex] && (
            <TokenCard
              isCompactMode={isCompactMode}
              width={data.cardWidth}
              height={data.cardHeight}
              token={tokens[rowIndex * data.columnCount + columnIndex]}
            />
          )}
        </div>
      );
    },
    areEqual
  );

  return (
    <div className={styles.TokenCardsPanel} data-testid="TokenCardsPanel">
      {tokens.length > 0 && (
        <Stack spacing={1}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ paddingRight: 2 }}
          >
            <Grid item sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{marginRight: 2}}>Total: {tokens.length}</Box>
              <ActiveFilters />
            </Grid>
            <Grid item>
              <Button
                onClick={() => setIsCompactMode(!isCompactMode)}
                variant={isCompactMode ? "outlined" : "contained"}
                size="small"
              >
                {isCompactMode ? (
                  <DensityLarge fontSize="small" />
                ) : (
                  <DensitySmall fontSize="small" />
                )}
              </Button>
              <Button
                onClick={() => {
                  dispatch({
                    type: "SET_TOKENS_SORT_ORDER",
                    payload: tokensSortOrder === "asc" ? "desc" : "asc",
                  });
                }}
                sx={{ marginLeft: 2 }}
                variant="contained"
                size="small"
              >
                Sort by rank
                {tokensSortOrder === "desc" ? (
                  <ArrowUpwardIcon fontSize="small" />
                ) : (
                  <ArrowDownwardIcon fontSize="small" />
                )}
              </Button>
            </Grid>
          </Grid>
          {/* Token Cards */}
          <div className={styles.AutoSizerContainer}>
            <AutoSizer>
              {({ width, height }) => {
                let columnCount = 2;
                if (width >= 600) {
                  columnCount = 3;
                } 
                if (width >= 850) {
                  columnCount = 4;
                }
                if (width >= 1100) {
                  columnCount = 5;
                }
                if (width >= 1350) {
                  columnCount = 6;
                }
                if (width >= 1600) {
                  columnCount = 7;
                }
                
                const columnWidth = width / columnCount;
                const rowHeight = isCompactMode
                  ? columnWidth * 1.25
                  : columnWidth * 1.80;
                const rowCount = Math.ceil(tokens.length / columnCount);
                return (
                  <FixedSizeGrid
                    width={width}
                    height={height}
                    columnCount={columnCount}
                    columnWidth={columnWidth}
                    rowCount={rowCount}
                    rowHeight={rowHeight}
                    itemData={{ cardWidth: columnWidth - 10, cardHeight: rowHeight, columnCount: columnCount }}
                  >
                    {TokenRenderer}
                  </FixedSizeGrid>
                );
              }}
            </AutoSizer>
          </div>
        </Stack>
      )}
    </div>
  );
};

export default TokenCardsPanel;
