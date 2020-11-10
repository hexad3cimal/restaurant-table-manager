import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import Loader from './components/Loader';
import routes from './routes';

export default function RouteHandler() {
  const routing = useRoutes(routes);

  return <Suspense fallback={<Loader />}>{routing}</Suspense>;
}
