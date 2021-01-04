import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    background: {
      dark: '#F4F6F8',
      default: colors.common.white,
      paper: colors.common.white,
    },
    primary: {
      main: '#118AB2',
    },
    secondary: {
      main: '#EF476F',
    },
    text: {
      primary: '#011627',
      secondary: '#343a40',
    },
  },
  colors: {
    red: {
      main: colors.red[500],
    },
  },

  shadows,
  typography,
});

export default theme;
