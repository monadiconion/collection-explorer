import "./App.css";

// @mui
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import {
  AppBar,
  Box,
  Button,
  createTheme,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";

// components
import AttributesFilterPanel from "./components/AttributesFilterPanel/AttributesFilterPanel";
import TokenCardsPanel from "./components/TokenCardsPanel/TokenCardsPanel";

// Redux
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "./_reducers";
import { initializeState, extractZipFile } from "./_actions";
import { useEffect } from "react";

// lodash
import _ from "lodash";

function App() {
  useEffect(() => {
    dispatch(initializeState());
  }, []);

  const isLoading = useSelector((state: RootState) => state.isLoading);
  const collectionSummary = useSelector(
    (state: RootState) => state.collectionSummary,
    shallowEqual
  );
  const dispatch = useDispatch();

  const readZipFile = async (event: any) => {
    const file = event.target.files[0];
    dispatch(extractZipFile(file));
  };

  const MainContainer = (
    <Box>
      <Grid container spacing={1} sx={{ height: "calc(100vh - 72px)" }}>
        <Grid item sm={3} md={3}>
          {collectionSummary && (
            <AttributesFilterPanel />
          )}
        </Grid>
        <Grid item sm={9} md={9} sx={{ backgroundColor: "#f3f4f6" }}>
          <TokenCardsPanel />
        </Grid>
      </Grid>
    </Box>
  );

  const theme = createTheme({
    components: {
      MuiChip: {
        defaultProps: {
          style: {
            borderRadius: 10,
          },
        },
      },
      MuiButtonBase: {
        defaultProps: {
          // The props to apply
          disableRipple: true, // No more ripple, on the whole application 💣!
        },
      },
    },
    palette: {
      primary: {
        main: "#01579b",
      },
    },
    typography: {
      button: {
        textTransform: "none",
      },
      fontSize: 14,
    },
    shape: {
      borderRadius: 10,
    },
  });

  const UploadButton = () => {
    const Input = styled("input")({
      display: "none",
    });
    return (
      <label htmlFor="contained-button-file">
        <Input
          accept="application/zip"
          id="contained-button-file"
          type="file"
          onChange={(event) => readZipFile(event)}
        />
        <Button variant="contained" component="span" color="info">
          {isLoading ? "Loading..." : "Upload zip"}
        </Button>
      </label>
    );
  };
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        <AppBar position="static" sx={{ boxShadow: 0 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Collection explorer
            </Typography>
            <UploadButton />
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{ paddingTop: 1 }} textAlign="center">
        {MainContainer}
      </Box>
    </ThemeProvider>
  );
}

export default App;
