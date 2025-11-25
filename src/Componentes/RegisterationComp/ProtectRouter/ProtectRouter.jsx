import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { mediaContext } from '../../../Context/MediaStore';

export default function ProtectRouter({ children }) {
  const { userData, saveUserData } = useContext(mediaContext);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && userData === '') {
      saveUserData();
    }
    setLoading(false);
  }, [userData, saveUserData]);

  if (loading) {
    return (
      <div className='loading d-flex justify-content-center align-items-center'>
        <i className="fa-5x fa-solid fa-cart-shopping fa-spin"></i>
      </div>
    );
  }

  if (!localStorage.getItem("token") || userData === '') {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}