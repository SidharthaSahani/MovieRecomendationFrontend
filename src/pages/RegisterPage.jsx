import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../constants';
import { styles } from '../styles/styles';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      const msg = 'Passwords do not match';
      setError(msg);
      return toast.error(msg);
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      if (response.data.token) {
        loginUser(response.data.user, response.data.token);
        toast.success('Registration successful!');
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={registerStyles.container}>
      <div style={registerStyles.box}>
        <div style={registerStyles.header}>
          <span style={registerStyles.logo}></span>
          <h1 style={registerStyles.title}>Create Account</h1>
          <p style={registerStyles.subtitle}>Join MovieHub today</p>
        </div>

        {error && (
          <div style={registerStyles.errorAlert}>
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={registerStyles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              placeholder="Pick a username"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Create a password"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="Confirm your password"
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
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={registerStyles.footer}>
          <p style={registerStyles.footerText}>
            Already have an account? <Link to="/login" style={registerStyles.link}>Login here</Link>
          </p>
          <button
            onClick={() => navigate('/')}
            style={registerStyles.backButton}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

const registerStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: '#fff',
  },
  box: {
    background: '#ffffff',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    border: '2px solid #000',
  },
  header: {
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
    gap: '15px',
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

export default RegisterPage;
