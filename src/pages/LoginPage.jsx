import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../constants';
import { styles } from '../styles/styles';

function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useAuth();

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
      // Regular user login (checked in DB)
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      if (response.data.token) {
        loginUser(response.data.user, response.data.token);
        toast.success('Login successful!');
        navigate('/'); // Users always go to home
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid user credentials';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.loginBox}>
        <div style={loginStyles.logoSection}>
          <span style={loginStyles.logo}></span>
          <h1 style={loginStyles.title}>Sign In</h1>
          <p style={loginStyles.subtitle}>Welcome back to MovieHub</p>
        </div>

        {error && (
          <div style={loginStyles.errorAlert}>
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={loginStyles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email"
              required
              autoFocus
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your password"
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
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={loginStyles.footer}>
          <p style={loginStyles.footerText}>
            Don't have an account? <Link to="/register" style={loginStyles.link}>Register here</Link>
          </p>
          <button
            onClick={() => navigate('/')}
            style={loginStyles.backButton}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

const loginStyles = {
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
  footerText: {
    color: '#666',
    marginBottom: '10px',
    fontSize: '13px',
  },
  link: {
    color: '#000',
    textDecoration: 'underline',
    fontWeight: '700',
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

export default LoginPage;
