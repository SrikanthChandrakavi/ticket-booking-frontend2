import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'User' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/api/users', {
      name: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role // Add role to user entity
    }).then(() => {
      localStorage.setItem('role', formData.role); // Store role
      setMessage('Registration successful!');
      setFormData({ username: '', email: '', password: '', role: 'User' });
    }).catch(err => setMessage('Error: ' + err.message));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          required
        />
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
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          required
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit" style={{ backgroundColor: '#ff6200', color: '#fff', padding: '10px', border: 'none', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
};

export default Signup;