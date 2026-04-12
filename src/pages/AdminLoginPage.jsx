import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../constants';
import { styles } from '../styles/styles';

function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Admin specific login endpoint
      const response = await axios.post(`${API_URL}/auth/admin/login`, credentials);
      
      if (response.data.token) {
        loginAdmin(response.data.user, response.data.token);
        toast.success('Admin login successful!');
        navigate('/admin');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid admin credentials';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={adminLoginStyles.container}>
      <div style={adminLoginStyles.loginBox}>
        <div style={adminLoginStyles.logoSection}>
          <span style={adminLoginStyles.logo}></span>
          <h1 style={adminLoginStyles.title}>Admin Portal</h1>
          <p style={adminLoginStyles.subtitle}>Restricted Access Only</p>
        </div>

        {error && (
          <div style={adminLoginStyles.errorAlert}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={adminLoginStyles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Admin Username</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter admin username"
              required
              autoFocus
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Admin Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter admin password"
              required
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              width: '100%',
              marginTop: '10px',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login as Admin'}
          </button>
        </form>

        <div style={adminLoginStyles.footer}>
          <button
            onClick={() => navigate('/')}
            style={adminLoginStyles.backButton}
          >
            ← Back to Public Site
          </button>
        </div>
      </div>
    </div>
  );
}

const adminLoginStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: '#fff',
  },
  loginBox: {
    background: '#ffffff',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    border: '2px solid #000',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  logo: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '10px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '8px',
    color: '#000',
    textTransform: 'uppercase',
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  errorAlert: {
    background: '#fff',
    border: '1px solid #000',
    color: '#000',
    padding: '12px 15px',
    fontSize: '13px',
    marginBottom: '20px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '700',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  footer: {
    marginTop: '25px',
    textAlign: 'center',
    borderTop: '1px solid #eee',
    paddingTop: '20px',
  },
  backButton: {
    background: 'transparent',
    color: '#000',
    border: 'none',
    padding: '10px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
};

export default AdminLoginPage;
