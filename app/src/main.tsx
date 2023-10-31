import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'register',
        async lazy() {
          const Register = (await import('./pages/Register/Register.tsx'))
            .default;
          return {
            element: <Register />,
          };
        },
      },
      {
        path: 'confirmation/:id',
        async lazy() {
          const ConfirmCode = (
            await import('./pages/ConfirmCode/ConfirmCode.tsx')
          ).default;
          return {
            element: <ConfirmCode />,
          };
        },
      },
      {
        path: 'login',
        async lazy() {
          const Login = (await import('./pages/Login/Login.tsx')).default;
          return {
            element: <Login />,
          };
        },
      },
      {
        path: 'dashboard',
        async lazy() {
          const Dashboard = (await import('./pages/Dashboard/Dashboard.tsx'))
            .default;
          return {
            element: (
              <ProtectedRoute element={<Dashboard />} verifyInfo={false} />
            ),
          };
        },
      },
      {
        path: 'appointments',
        async lazy() {
          const Appointments = (
            await import('./pages/Appointments/Appointments.tsx')
          ).default;
          return {
            element: (
              <ProtectedRoute element={<Appointments />} verifyInfo={false} />
            ),
          };
        },
      },
      {
        path: 'profile',
        async lazy() {
          const Profile = (await import('./pages/Profile/Profile.tsx')).default;
          return {
            element: (
              <ProtectedRoute element={<Profile />} verifyInfo={false} />
            ),
          };
        },
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
