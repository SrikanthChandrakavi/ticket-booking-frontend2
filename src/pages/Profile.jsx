import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const userId = localStorage.getItem('userId');
  const [user, setUser] = useState({ name: '', age: '', gender: '', phoneNumber: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8081/api/users/${userId}`).then(res => {
        setUser({
          name: res.data.name || '',
          age: res.data.age || '',
          gender: res.data.gender || '',
          phoneNumber: res.data.phoneNumber || ''
        });
      }).catch(err => setMessage('Error fetching user: ' + err.message));
    }
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (userId) {
      axios.put(`http://localhost:8081/api/users/${userId}`, {
        name: user.name,
        age: user.age ? parseInt(user.age) : null, // Convert to integer
        gender: user.gender,
        phoneNumber: user.phoneNumber
      }).then(res => {
        if (res.status === 200) {
          setMessage('Profile updated successfully!');
        }
      }).catch(err => {
        setMessage('Error updating profile: ' + (err.response?.data || err.message));
      });
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Profile</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={user.age}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          required
        />
        <select
          name="gender"
          value={user.gender}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={user.phoneNumber}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          required
        />
        <button type="submit" style={{ backgroundColor: '#ff6200', color: '#fff', padding: '10px', border: 'none', cursor: 'pointer' }}>
          Update
        </button>
      </form>
      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
};

export default Profile;