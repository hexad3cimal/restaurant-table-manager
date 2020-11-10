import React from 'react';
import { Helmet } from 'react-helmet-async';
import config from 'config';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'theme/GlobalStyles';
import theme from 'theme';
import RouteHandler from './router';

export class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Helmet
          defer={false}
          htmlAttributes={{ lang: 'en' }}
          encodeSpecialCharacters={true}
          defaultTitle={config.name}
          titleTemplate={`%s | ${config.name}`}
          titleAttributes={{ itemprop: 'name', lang: 'en' }}
        >
          <script src="import.js" />
        </Helmet>
        <ToastContainer />
        <GlobalStyles />

        <RouteHandler />
      </ThemeProvider>
    );
  }
}

export default App;
