import React, { lazy } from 'react';
import MainLayout from './layouts/MainLayout';

const LoginView = lazy(() => import('./views/auth/LoginView'));
const RegisterView = lazy(() => import('./views/auth/RegisterView'));

const routes = isLoggedIn => [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      // { path: '404', element: <NotFoundView /> },
      // { path: '*', element: <Navigate to="/404" /> }
    ],
  },
];

export default routes;
