import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import Loader from './components/Loader';
import routes from './routes';
import { useSelector } from 'react-redux';

export default function RouteHandler() {
  const loggedIn = useSelector(state => state.user).isAuthenticated;
  const routing = useRoutes(routes(loggedIn));

  return <Suspense fallback={<Loader />}>{routing}</Suspense>;
}
