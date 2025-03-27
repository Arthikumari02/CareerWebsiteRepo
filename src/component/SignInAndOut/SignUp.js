import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import { useAuth } from './AuthContext';
import './styles/SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [error, setError] = useState('');
  const [user, setUser] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    const { email, password } = user;

    if (!validator.isEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const result = await signUp(email, password);

    if (result.success) {
      alert('Sign-up successful! Please Sign In.');
      navigate('/signin');
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{height:"100vh", display:"flex", flexDirection:"column", 
      justifyContent:"center", alignItems:"center"
    }}>
      <div className="signup-container">
        <h1>Sign Up</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <button onClick={() => navigate('/signin')}>Sign In</button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;