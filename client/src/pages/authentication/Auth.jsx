import React, { useState } from 'react';
import './Auth.css';
import { FaGoogle } from "react-icons/fa";
import animation_resume from '../../assets/animation_auth_2.webm'
import { apiClient } from '../../lib/api_client';
import { toast } from 'sonner';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateLogin = async () => {

  }

  const validateSignup = async () => {
    
  }

  const handleLogin = async () => {

  }

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="placeholder-image">
        <video
          src={animation_resume}
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', maxWidth: '300px', marginBottom: '1rem', borderRadius: '10px' }}
        />
        <h2>Welcome to Our Platform</h2>
        <p>One step closer to landing your dream job</p>
        </div>
      </div>
      
      <div className="auth-right">
        <div className="auth-switch">
          <button 
            className={`switch-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button 
            className={`switch-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="auth-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <button type="button" className="google-btn">
          <FaGoogle style={{ marginRight: '8px' }}/>
            {isLogin ? `Sign In with Google` : `Sign Up with Google`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;