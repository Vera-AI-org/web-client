// theme/index.ts
import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0d47a1", // azul escuro
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#00b4d8", // pacific-cyan (mantido)
    },
    background: {
      default: "#fcfcfc", // branco suave para background (ajustado)
      paper: "#f5f6fa", // branco puro para superfícies
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        color: "primary",
      },
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});
