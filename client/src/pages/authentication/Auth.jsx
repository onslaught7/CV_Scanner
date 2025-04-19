import React, { useState } from 'react';
import './Auth.css';
import { FaGoogle } from "react-icons/fa";
import animation_resume from '../../assets/animation_auth_2.webm'
import { apiClient } from '../../lib/api_client.js';
import toast, { Toaster } from 'react-hot-toast';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../../utils/constants.js';
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/index.js';

const Auth = () => {
  const navigate = useNavigate()

  const { setUserInfo, setToastMessage } = useAppStore();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateLogin = () => {
    if (!username.length) {
      toast.error("Email is required");
      return false;
    } 
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true
  }

  const validateSignup = () => {
    if (!username.length) {
      toast.error("Email is required");
      return false
    }
    if (!password.length) {
      toast.error("Password is required");
      return false
    }
    if (password !== confirmPassword) {
      toast.error("passwords don't match");
      return false;
    }
    return true;    
  }

  const handleLogin = async () => {
    try {
      if (validateLogin()) {
        const toastId = toast.loading('Signing in...');
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        const response = await apiClient.post(
          LOGIN_ROUTE,
          formData,
          {
            headers: {'Content-Type': 'multipart/form-data'}, 
            withCredentials: true 
          }
        )

        console.log("response for login", response);

        if (response.data) {
          const { name, access_token } = response.data;
          setUserInfo({name, access_token});
          toast.dismiss(toastId);
          setToastMessage(`Welcome back, ${name}!`);
          navigate('/home');
        }
      }
    } catch (error) {
      toast.dismiss();
      if (error.response && error.response.status === 400) {
        toast.error("Email and Password combination is incorrect");
      } else {
        toast.error("Account doesn't exist, Sign Up instead");
      }
    }
  }

  const handleSignup = async () => {
    try {
      if (validateSignup()) {
        const toastId = toast.loading('Creating account...');
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          {
            "username": name,
            "email": username,
            "password": password
          },
          { withCredentials: true }
        )

        console.log("response while signup", response);
        if (response.status === 201 || response.status === 200) {
          const { name, access_token } = response.data;
          setUserInfo({ name, access_token });
          toast.dismiss(toastId);
          setToastMessage(`Account created successfully, ${name}!`)
          navigate("/home")
        }
      }
    } catch (error) {
      toast.dismiss();
      if (error.response && error.response.status === 400) {
        toast.error("Error while signing up");
        console.log("Email already exists");
      } else {
        console.error("An unexpected error occured: ", error);
      }
    }
  }

  const handleGoogleLogin = async () => {

  }

  const handleGoogleSignup = async () => {
  
  }

  return (
    <div className="auth-container">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          // Custom styles for different types
          success: {
            style: {
              background: 'green',
            },
          },
          error: {
            style: {
              background: 'red',
            },
          },
        }}
      />
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

        <form className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              name="username"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          {
            !isLogin ?
              (
                <button 
                  type="button" 
                  className="auth-btn"
                  onClick={handleSignup}
                  >
                  Sign Up
                </button>
              ) :
              (
                <button 
                  type="button" 
                  className="auth-btn"
                  onClick={handleLogin}
                >
                  Sign In
                </button>
              )
          }

          <div className="auth-divider">
            <span>OR</span>
          </div>

          {
            !isLogin ?
              (
                <button 
                  type="button" 
                  className="google-btn"
                  onClick={handleGoogleSignup}
                  >
                  <FaGoogle style={{ marginRight: '8px' }}/>
                  Sign Up With Google
                </button>
              ) :
              (
                <button 
                  type="button" 
                  className="google-btn"
                  onClick={handleGoogleLogin}
                >
                <FaGoogle style={{ marginRight: '8px' }}/>
                  Sign In With Google
                </button>
              )
          }
        </form>
      </div>
    </div>
  );
};

export default Auth;