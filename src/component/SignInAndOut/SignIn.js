import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './styles/SignUp.css'

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = existingUsers.find((user) => user.email === email);

    if (!user) {
      setError('User not found. Please sign up first.');
      return;
    }

    login();
    localStorage.setItem('user', JSON.stringify(user));
    alert('Sign-in successful!');
    navigate('/career-website-repo');
  };

  return (
    <div style={{height:"100vh", display:"flex", flexDirection:"column", 
        justifyContent:"center", alignItems:"center"}}>
        <div className="signup-container">
            <h1>Sign In</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSignIn}>
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <button type="submit">Sign In</button>
            </form>
            <p>
                Don't have an account? <a href="/signup">Sign Up</a>
            </p>
            <p>
                Forgot your password? <a href="/forgot-password">Reset Password</a>
            </p>
        </div>
    </div>
  );
};

export default SignIn;
