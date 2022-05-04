import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import React, { FC } from "react";
import { AttributeData, AttributeFilter, CollectionSummary } from "../../types";
import styles from "./AttributesFilterPanel.module.css";
import { setAttributeFilter } from "../../_actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_reducers";

const AttributesFilterPanel = () => {
  const dispatch = useDispatch();

  const attributeSearchFiltersByTraitType = useSelector(
    (state: RootState) => state.attributeSearchFiltersByTraitType
  );

  const TraitFilter = (props: { attributeFilter: AttributeFilter }) => {
    return (
      <FormControlLabel
        checked={props.attributeFilter.isChecked}
        control={<Checkbox />}
        onChange={(event: any) => {
          dispatch(
            setAttributeFilter(
              props.attributeFilter.trait_type,
              props.attributeFilter.value,
              event.target.checked
            )
          );
        }}
        label={
          props.attributeFilter.value + ` (${props.attributeFilter.count})`
        }
      />
    );
  };

  const AttributeFilters = Object.keys(attributeSearchFiltersByTraitType).map(
    (attribute) => (
      <Accordion key={attribute} disableGutters elevation={0} square>
        <AccordionSummary expandIcon={<ExpandMore />} id={attribute}>
          <Typography>{attribute}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {attributeSearchFiltersByTraitType[attribute].map(
              (attributeFilter: AttributeFilter) => (
                <TraitFilter
                  key={attributeFilter.trait_type + " " + attributeFilter.value}
                  attributeFilter={attributeFilter}
                />
              )
            )}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    )
  );

  return (
    <Stack
      className={styles.AttributesFilterPanel}
      sx={{ height: "calc(100vh - 72px)", overflow: "auto" }}
      data-testid="AttributesFilterPanel"
    >
      {AttributeFilters}
    </Stack>
  );
};

export default React.memo(AttributesFilterPanel);
