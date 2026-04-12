import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/styles';

function AdminNavbar() {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navBrand}>
        <Link to="/admin" style={styles.navLogo}>
          Admin Dashboard
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
        <Link
          to="/admin"
          style={styles.navLink}
          onMouseEnter={(e) => e.currentTarget.style.background = styles.navLinkHover.background}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          Admin Dashboard
        </Link>
        
        <div style={styles.userSection}>
          <span style={styles.welcomeText}>{admin?.username}</span>
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ccc'}
            onMouseLeave={(e) => e.currentTarget.style.color = styles.logoutButton.color}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
