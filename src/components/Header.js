import React from 'react';
import './Header.css';
import lumenLogo from '../assets/lumen-logo.png'; // Add this import

const Header = () => {
  return (
    <div className="header">
      <div className="header-left">
        <div className="logo">
          <img src={lumenLogo} alt="Lumen" className="logo-icon" />
          <div className="logo-text">
            <p></p>
          </div>
        </div>
      </div>
      <div className="header-center">
        <nav>
          <a href="#create" className="create-proposal-link">Create Proposal</a>
        </nav>
      </div>
      <div className="header-right">
        <nav>
          <a href="#templates">My Templates</a>
          <a href="#support">Help & Support</a>
        </nav>
        <div className="user-profile">
          <div className="avatar">JD</div>
          <div className="user-info">
            <span className="user-name">John Doe</span>
            <span className="user-role">Senior Manager</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;