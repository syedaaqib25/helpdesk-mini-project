import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isDarkMode, toggleTheme } = useAuth();

  const renderUserGreeting = () => {
    if (!user) return null;

    switch (user.role) {
      case 'ADMIN':
        return <div className="admin-badge">Welcome, {user.name} (Admin)</div>;
      case 'AGENT':
        return <div className="agent-badge">Welcome, {user.name} (Agent)</div>;
      case 'USER':
        return <div className="user-badge">Welcome, {user.name}</div>;
      default:
        return <span className="navbar-user-info">Welcome, {user.name}</span>;
    }
  };

  return (
    <nav className='navbar'>
      <Link to="/" className='navbar-brand'>HelpDesk</Link>
      <div className='navbar-links'>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {user ? (
          <>
            {renderUserGreeting()}
            <button onClick={logout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/register" className="nav-link">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;