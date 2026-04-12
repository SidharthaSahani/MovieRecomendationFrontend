import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/styles';

function UserNavbar() {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navBrand}>
        <Link to="/" style={styles.navLogo}>
           MovieHub
        </Link>
      </div>
      
      <div style={styles.navLinks}>
        <Link
          to="/"
          style={styles.navLink}
          onMouseEnter={(e) => e.currentTarget.style.background = styles.navLinkHover.background}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          Home
        </Link>
        
        {isAuthenticated ? (
          <div style={styles.userSection}>
            <span style={styles.welcomeText}>Hi, {user.username}</span>
            <button
              onClick={handleLogout}
              style={styles.logoutButton}
              onMouseEnter={(e) => e.currentTarget.style.color = '#666'}
              onMouseLeave={(e) => e.currentTarget.style.color = styles.logoutButton.color}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              style={styles.navLink}
              onMouseEnter={(e) => e.currentTarget.style.background = styles.navLinkHover.background}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={styles.registerBtn}
              onMouseEnter={(e) => e.currentTarget.style.background = '#d42a09'}
              onMouseLeave={(e) => e.currentTarget.style.background = styles.registerBtn.background}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default UserNavbar;
