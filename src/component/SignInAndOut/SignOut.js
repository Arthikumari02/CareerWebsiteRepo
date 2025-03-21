import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert('You have been logged out.');
    navigate('/signup');
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
