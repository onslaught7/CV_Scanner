import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="navbar">
      <div className="nav-right">
        <h2>LOGO</h2>
      </div>

      <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <div className={`nav-left ${menuOpen ? 'open' : ''}`}>
        <button className="nav-btn">Home</button>
        <button className="nav-btn">Support</button>
        <button className="nav-btn">Contact</button>
        <button className="nav-btn-out">Log Out</button>
      </div>
    </div>
  );
};

export default Navbar;
