import React, { useContext, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { mediaContext } from '../../Context/MediaStore';
import AuthLayout from '../Layouts/AuthLayout/AuthLayout';
import Login from '../RegisterationComp/Login/Login';
import SignUp from '../RegisterationComp/SignUp/SignUp';
import ForgetPassword from '../RegisterationComp/ForgetPassword/ForgetPassword';
import ResetPassword from '../RegisterationComp/ResetPassword/ResetPassword';

// 🔴 LAZY LOAD HEAVY COMPONENTS
const DiabeticsAnalysis = React.lazy(() => 
  import('../DiabeticsAnalysis/DiabeticsAnalysis').then(module => ({
    default: module.default
  }))
);

// Loading Fallback Component
function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ textAlign: 'center' }}>
        <i 
          className="fas fa-spinner fa-spin" 
          style={{ 
            fontSize: '48px', 
            color: '#007bff',
            marginBottom: '20px'
          }}
        ></i>
        <p style={{ fontSize: '18px', color: '#666' }}>
          Loading application...
        </p>
        <div style={{
          marginTop: '20px',
          width: '200px',
          height: '4px',
          backgroundColor: '#e9ecef',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            backgroundColor: '#007bff',
            animation: 'progress 1.5s ease-in-out infinite',
            width: '30%'
          }}></div>
        </div>
      </div>
      <style>{`
        @keyframes progress {
          0% { width: 30%; }
          50% { width: 70%; }
          100% { width: 30%; }
        }
      `}</style>
    </div>
  );
}

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
          <Suspense fallback={<LoadingFallback />}>
            <DiabeticsAnalysis />
          </Suspense>
        </ProtectedRoute>
      ),
      errorElement: <ErrorBoundary />
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

// Error Boundary for route errors
function ErrorBoundary() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <i className="fas fa-exclamation-circle" style={{ fontSize: '48px', color: '#dc3545' }}></i>
      <h2>Something went wrong</h2>
      <p>Please refresh the page or try again later</p>
    </div>
  );
}

export default App;