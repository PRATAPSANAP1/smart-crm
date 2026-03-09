import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsOpen(false);
    navigate('/');
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="navbar">
      <h1>🏛️ Smart Public Service CRM</h1>
      
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={isOpen ? 'nav-open' : ''}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        {user ? (
          <>
            {user.role === 'admin' ? (
              <>
                <Link to="/admin" onClick={closeMenu}>Dashboard</Link>
                <Link to="/map" onClick={closeMenu}>Map</Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            ) : (
              <>
                <Link to="/submit-complaint" onClick={closeMenu}>Submit Complaint</Link>
                <Link to="/my-complaints" onClick={closeMenu}>My Complaints</Link>
                <Link to="/map" onClick={closeMenu}>Map</Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            )}
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>Login</Link>
            <Link to="/register" onClick={closeMenu}>Register</Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
