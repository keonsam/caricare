import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import Home from './pages/Home/Home.tsx';
import Login from './pages/Login/Login.tsx';
import Register from './pages/Register/Register.tsx';
import ConfirmCode from './pages/ConfirmCode/ConfirmCode.tsx';
import UserInfo from './pages/UserInfo/UserInfo.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'confirmation/:id',
        element: <ConfirmCode />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'create-profile',
        element: <UserInfo />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
