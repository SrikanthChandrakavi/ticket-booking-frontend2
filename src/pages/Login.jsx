import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/api/users/login', {
      email: formData.email,
      password: formData.password
    }).then(res => {
      if (res.data !== 'Invalid credentials') {
        const userId = res.data;
        axios.get(`http://localhost:8081/api/users/${userId}`).then(userRes => {
          const username = userRes.data.name || formData.email.split('@')[0];
          const role = userRes.data.role || 'User'; // Fetch role from backend
          localStorage.setItem('userId', userId);
          localStorage.setItem('username', username);
          localStorage.setItem('role', role); // Store role
          setMessage('Login successful!');
          setTimeout(() => {
            if (role === 'Admin') {
              navigate('/admin-dashboard');
            } else {
              navigate('/');
            }
          }, 1000);
        });
      } else {
        setMessage('Invalid credentials');
      }
    }).catch(err => setMessage('Error: ' + err.message));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          required
        />
        <button type="submit" style={{ backgroundColor: '#ff6200', color: '#fff', padding: '10px', border: 'none', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
      {message && <p style={{ color: message.includes('Invalid') || message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
};

export default Login;