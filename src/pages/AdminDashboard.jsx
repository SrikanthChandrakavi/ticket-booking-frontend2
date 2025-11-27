import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [movie, setMovie] = useState({ title: '', description: '', duration: '', poster: null, language: '' });
  const [shows, setShows] = useState([{ date: '', time: '', theaterId: '', price: '', id: null }]);
  const [theaters, setTheaters] = useState([]);
  const [message, setMessage] = useState('');
  const [showListVisible, setShowListVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const movieId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    axios.get('http://localhost:8081/api/theaters')
      .then(res => {
        setTheaters(res.data);
        if (res.data.length === 0) {
          const predefinedTheaters = [
            { id: 1, name: 'INOX Laila Mall', location: 'Laila Mall' },
            { id: 2, name: 'G3 Raj YuvRaj', location: 'Raj Nagar' },
            { id: 3, name: 'Sailaja Theatre', location: 'Main Street' }
          ];
          setTheaters(predefinedTheaters);
        }
      })
      .catch(err => console.error('Error fetching theaters:', err));

    if (movieId) {
      axios.get(`http://localhost:8081/api/movies/${movieId}`)
        .then(res => {
          const movieData = res.data;
          setMovie({
            title: movieData.title,
            description: movieData.description,
            duration: movieData.duration,
            poster: null,
            language: movieData.language || ''
          });
          axios.get(`http://localhost:8081/api/shows/movie/${movieId}/details`)
            .then(showRes => {
              setShows(showRes.data.map(show => ({
                date: show.showtime ? new Date(show.showtime).toISOString().split('T')[0] : '',
                time: show.showtime ? new Date(show.showtime).toTimeString().split(' ')[0].slice(0, 5) : '',
                theaterId: show.theater?.id || '',
                price: show.price || '',
                id: show.id
              })));
            })
            .catch(err => console.error('Error fetching shows:', err));
        })
        .catch(err => console.error('Error fetching movie:', err));
    }
  }, [movieId]);

  const handleMovieChange = (e) => {
    const { name, value, files } = e.target;
    setMovie(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleShowChange = (index, e) => {
    const { name, value } = e.target;
    const newShows = [...shows];
    newShows[index][name] = value;
    setShows(newShows);
  };

  const addShowField = () => {
    setShows([...shows, { date: '', time: '', theaterId: '', price: '', id: null }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', movie.title);
    formData.append('description', movie.description);
    formData.append('duration', movie.duration);
    formData.append('language', movie.language);
    if (movie.poster) formData.append('poster', movie.poster);
    if (shows.length > 0) {
      shows.forEach((show, index) => {
        formData.append(`showIds`, show.id || '');
        formData.append(`showDates`, show.date || '');
        formData.append(`showTimes`, show.time || '');
        formData.append(`theaterIds`, show.theaterId || '');
        formData.append(`prices`, show.price || '');
      });
    } else {
      console.warn('No shows provided');
    }
    console.log([...formData.entries()]); // Debug output
    const url = movieId ? `http://localhost:8081/api/movies/${movieId}` : 'http://localhost:8081/api/movies';
    const method = movieId ? 'put' : 'post';

    axios({ method, url, data: formData, headers: { 'Content-Type': 'multipart/form-data' } })
      .then(res => {
        setMessage(res.data);
        setMovie({ title: '', description: '', duration: '', poster: null, language: '' });
        setShows([{ date: '', time: '', theaterId: '', price: '', id: null }]);
        navigate('/admin-movies');
      })
      .catch(err => setMessage('Error: ' + (err.response?.data || err.message || 'Connection reset')));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <nav style={{ backgroundColor: '#333', padding: '10px', marginBottom: '20px' }}>
        <Link to="/admin-dashboard" style={{ color: 'white', marginRight: '20px' }}>Add Movie</Link>
        <Link to="/admin-movies" style={{ color: 'white' }}>Added Movies</Link>
      </nav>
      <h2>{movieId ? 'Edit Movie' : 'Add Movie'}</h2>
      <button onClick={() => setShowListVisible(!showListVisible)} style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', margin: '10px 0' }}>
        {showListVisible ? 'Hide Theater List' : 'Show Theater List'}
      </button>
      {showListVisible && (
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {theaters.map(theater => (
            <li key={theater.id} style={{ padding: '5px' }}>{theater.name}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={movie.title}
          onChange={handleMovieChange}
          style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={movie.description}
          onChange={handleMovieChange}
          style={{ width: '100%', padding: '8px', margin: '10px 0', height: '100px' }}
          required
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g., 2h 30m)"
          value={movie.duration}
          onChange={handleMovieChange}
          style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          required
        />
        <select
          name="language"
          value={movie.language}
          onChange={handleMovieChange}
          style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          required
        >
          <option value="">Select Language</option>
          <option value="Tamil">Tamil</option>
          <option value="Malayalam">Malayalam</option>
          <option value="Kannada">Kannada</option>
          <option value="Hindi">Hindi</option>
          <option value="Telugu">Telugu</option>
          <option value="English">English</option>
        </select>
        <input
          type="file"
          name="poster"
          accept="image/*"
          onChange={handleMovieChange}
          style={{ width: '100%', padding: '8px', margin: '10px 0' }}
        />
        <h3>Add/Edit Shows</h3>
        {shows.map((show, index) => (
          <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
            <input
              type="date"
              name="date"
              value={show.date}
              onChange={(e) => handleShowChange(index, e)}
              style={{ width: '45%', padding: '8px', marginRight: '5%' }}
              required
            />
            <input
              type="time"
              name="time"
              value={show.time}
              onChange={(e) => handleShowChange(index, e)}
              style={{ width: '45%', padding: '8px' }}
              required
            />
            <select
              name="theaterId"
              value={show.theaterId}
              onChange={(e) => handleShowChange(index, e)}
              style={{ width: '45%', padding: '8px', marginRight: '5%', marginTop: '10px' }}
              required
            >
              <option value="">Select Theater</option>
              {theaters.map(theater => (
                <option key={theater.id} value={theater.id}>{theater.name}</option>
              ))}
            </select>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={show.price}
              onChange={(e) => handleShowChange(index, e)}
              style={{ width: '45%', padding: '8px', marginTop: '10px' }}
              step="0.01"
              required
            />
          </div>
        ))}
        <button type="button" onClick={addShowField} style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', margin: '10px 0' }}>Add Another Show</button>
        <button type="submit" style={{ backgroundColor: '#ff6200', color: '#fff', padding: '10px', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
          {movieId ? 'Update Movie & Shows' : 'Add Movie & Shows'}
        </button>
      </form>
      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
};

export default AdminDashboard;