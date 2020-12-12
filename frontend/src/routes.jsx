import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

const LoginView = lazy(() => import('./views/auth/LoginView'));
const RegisterView = lazy(() => import('./views/auth/RegisterView'));
const DashboardView = lazy(() => import('./views/DashboardView'));
const NotFoundView = lazy(() => import('./views/errors/NotFoundView'));
const BranchView = lazy(() => import('./views/Branch'));
const TableView = lazy(() => import('./views/Table'));
const TableDetailedView = lazy(() => import('./views/Table/Table'));
const TableDashboard = lazy(() => import('./views/TableView'));

const KitchenView = lazy(() => import('./views/Kitchen'));

const ProductView = lazy(() => import('./views/Product'));

const routes = isLoggedIn => [
  {
    path: 'app',
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/404" />,
    children: [
      // { path: 'account', element: <AccountView /> },
      // { path: 'customers', element: <CustomerListView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'branch', element: <BranchView /> },
      {
        path: 'table',
        element: <TableView />
            },
      { path: 'product', element: <ProductView /> },
      { path: 'kitchen', element: <KitchenView /> },
      { path: 'table-details', element: <TableDetailedView /> },
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Navigate to="/login" /> },
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: 'table/:code', element: <TableDashboard /> },

      { path: '404', element: <NotFoundView /> },
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
];

export default routes;
