import { createMuiTheme, colors } from "@material-ui/core";
import shadows from "./shadows";
import typography from "./typography";

const theme = createMuiTheme({
  palette: {
    background: {
      dark: "#F4F6F8",
      default: colors.common.white,
      paper: colors.common.white,
    },
    primary: {
      main: "#118AB2",
    },
    secondary: {
      main: "#EF476F",
    },
    text: {
      primary: "#011627",
      secondary: "#343a40",
    },
  },
  colors: {
    red: '#e71d36',
    cardColors: ["", "#ffd166", "#06d6a0", "#c77dff", "#8ac926"],
    green: "#548c27",
    grey: '#8a817c',
    white:'#fefae0'
  },

  shadows,
  typography,
});

export default theme;
