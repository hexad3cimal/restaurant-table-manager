import React from 'react';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from './theme/GlobalStyles';
import theme from './theme';
import RouteHandler from './router';
import { Helmet } from 'react-helmet-async';
import config from './config'
export class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>

        <ToastContainer />
        <GlobalStyles />
        <Helmet
  defer={false}
  htmlAttributes={{ lang: 'en' }}
  encodeSpecialCharacters={true}
  defaultTitle={config.name}
  titleTemplate={`%s | ${config.name}`}
  titleAttributes={{ itemprop: 'name', lang: 'en' }}
>
</Helmet>
        <RouteHandler />
      
      </ThemeProvider>
    );
  }
}

export default App;
