import React, { useContext } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { mediaContext } from '../../Context/MediaStore';
import AuthLayout from '../Layouts/AuthLayout/AuthLayout';
import Login from '../RegisterationComp/Login/Login';
import SignUp from '../RegisterationComp/SignUp/SignUp';
import ForgetPassword from '../RegisterationComp/ForgetPassword/ForgetPassword';
import ResetPassword from '../RegisterationComp/ResetPassword/ResetPassword';
import DiabeticsAnalysis from '../DiabeticsAnalysis/DiabeticsAnalysis';

function ProtectedRoute({ children }) {
  const { userData } = useContext(mediaContext);
  
  if (!localStorage.getItem('token')) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return children;
}

function PublicRoute({ children }) {
  if (localStorage.getItem('token')) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DiabeticsAnalysis />
        </ProtectedRoute>
      )
    },
    {
      path: '/auth',
      element: (
        <PublicRoute>
          <AuthLayout />
        </PublicRoute>
      ),
      children: [
        { index: true, element: <Navigate to="/auth/login" replace /> },
        { path: 'login', element: <Login /> },
        { path: 'signup', element: <SignUp /> },
        { path: 'forget-password', element: <ForgetPassword /> },
        { path: 'reset-password', element: <ResetPassword /> }
      ]
    },
    {
      path: '*',
      element: <Navigate to="/" replace />
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;