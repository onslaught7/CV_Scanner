import React, { useState } from 'react'; 
import './Navbar.css';
import { VscVerified } from "react-icons/vsc";
import { LOGOUT_ROUTE } from '../utils/constants.js';
import { apiClient } from '../lib/api_client.js';
import { useAppStore } from '../store/index.js';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const { userInfo, setUserInfo } = useAppStore();

  const handleLogout = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      )

      if (response.status === 200) {
        setUserInfo(undefined);
        navigate("/auth");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className="navbar">
      <div className="nav-right">
        <h2>
          CV SCANNER <VscVerified /> 
        </h2>
      </div>

      <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <div className={`nav-left ${menuOpen ? 'open' : ''}`}>
        <button className="nav-btn">Home</button>
        <button className="nav-btn">Support</button>
        <button className="nav-btn">Contact</button>
        <button 
          type="button" 
          className="nav-btn-out"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
