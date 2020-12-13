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
      main: colors.blue[600],
    },
    secondary: {
      main: colors.blue[500],
    },
    text: {
      primary: colors.lightGreen[900],
      secondary: colors.lightGreen[600],
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
