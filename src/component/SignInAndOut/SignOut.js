import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    alert('You have been logged out.');
    navigate('/signin');
  };

  return <button onClick={handleLogout}>Sign Out</button>;
};

export default LogoutButton;