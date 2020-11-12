import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

const LoginView = lazy(() => import('./views/auth/LoginView'));
const RegisterView = lazy(() => import('./views/auth/RegisterView'));
const DashboardView = lazy(() => import('./views/DashboardView'));
const NotFoundView = lazy(() => import('./views/errors/NotFoundView'));

const routes = isLoggedIn => [
  {
    path: 'app',
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/404" /> ,
    children: [
      // { path: 'account', element: <AccountView /> },
      // { path: 'customers', element: <CustomerListView /> },
      { path: 'dashboard', element: <DashboardView /> },
      // { path: 'products', element: <ProductListView /> },
      // { path: 'settings', element: <SettingsView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ],
  },
];

export default routes;
