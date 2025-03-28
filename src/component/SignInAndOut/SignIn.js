import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './styles/SignUp.css'

const SignIn = () => {
  const navigate = useNavigate();
  const { login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const result = await login(email, password);
  
      if (result.success) {
        const userId = result.user?.uid;
  
        if (!userId) {
          throw new Error('User ID (UID) is missing');
        }
  
        // Navigate to dashboard, letting AuthContext handle progress loading
        navigate('/career-website-repo');
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      setError(error.message || 'An error occurred during sign-in');
    }
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