import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">PS</span>
          <div className="logo-text">
            <h1>ProSlides</h1>
            <p>Professional Proposal Solutions</p>
          </div>
        </div>
      </div>
      <div className="header-center">
        <button className="create-proposal-btn">Create Proposal</button>
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