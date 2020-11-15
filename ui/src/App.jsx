import React from 'react';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'theme/GlobalStyles';
import theme from 'theme';
import RouteHandler from './router';

export class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>

        <ToastContainer />
        <GlobalStyles />

        <RouteHandler />
      </ThemeProvider>
    );
  }
}

export default App;
