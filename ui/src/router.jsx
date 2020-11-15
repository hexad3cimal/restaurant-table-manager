import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import Loader from './components/Loader';
import routes from './routes';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import config from './config'
export default function RouteHandler() {
  const loggedIn = useSelector(state => state.user).isAuthenticated;
  const routing = useRoutes(routes(loggedIn));

  return <Suspense fallback={<Loader />}>        <Helmet
  defer={false}
  htmlAttributes={{ lang: 'en' }}
  encodeSpecialCharacters={true}
  defaultTitle={config.name}
  titleTemplate={`%s | ${config.name}`}
  titleAttributes={{ itemprop: 'name', lang: 'en' }}
>
  <script src="/scripts/import.js" />
</Helmet>{routing}</Suspense>;
}
