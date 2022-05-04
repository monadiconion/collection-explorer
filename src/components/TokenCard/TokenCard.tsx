import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Grid,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Skeleton,
} from "@mui/material";
import React, { FC } from "react";
import { TokenDataWithRarity } from "../../types";
import SuspenseImage from "../SuspenseImage/SuspenseImage";
import styles from "./TokenCard.module.css";

interface TokenCardProps {
  token: TokenDataWithRarity;
  width: number;
  height: number;
  isCompactMode?: boolean;
}

const TokenCard: FC<TokenCardProps> = ({
  token,
  isCompactMode = true,
  width,
  height,
}) => (
  <Card sx={{ width: width }} elevation={1}>
    <CardActionArea>
      <React.Suspense
        fallback={
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={width}
            height={height}
          />
        }
      >
        <SuspenseImage src={token?.image} className={styles.CardImage} />
      </React.Suspense>
      <CardContent sx={{ padding: 1 }}>
        <Grid container alignItems="center">
          <Grid item xs={9}>
            <Typography variant="subtitle1">{token.name}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Chip
              label={token.rank}
              color="info"
              sx={{ minWidth: 50, fontFamily: "Roboto Mono", fontSize: 14 }}
            />
          </Grid>
          {!isCompactMode && (
            <Grid item xs={12}>
              <Table size="small" sx={{ fontFamily: "Roboto Mono" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Trait</TableCell>
                    <TableCell align="right">Rarity</TableCell>
                    {/* <TableCell align="right">%</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {token.attributes.slice(0, 3).map((attribute) => (
                    <TableRow
                      key={`${attribute.trait_type}: ${attribute.value}`}
                    >
                      <TableCell
                        sx={{
                          fontSize: 10,
                          maxWidth: "110px",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >{`${attribute.trait_type}: ${attribute.value}`}</TableCell>
                      <TableCell align="right">1/{attribute.count}</TableCell>
                      {/* <TableCell align="right">
                        {attribute.rarity_percentage}
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default React.memo(TokenCard);
