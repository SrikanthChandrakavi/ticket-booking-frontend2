import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AddedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', duration: '', poster: null, language: '' });
  const [shows, setShows] = useState([{ date: '', time: '', theaterId: '', price: '', id: null }]);
  const [theaters, setTheaters] = useState([]);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchMovies();
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
  }, []);

  const fetchMovies = () => {
    axios.get('http://localhost:8081/api/movies')
      .then(res => setMovies(res.data))
      .catch(err => setMessage('Error fetching movies: ' + err.message));
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setEditForm({
      title: movie.title,
      description: movie.description,
      duration: movie.duration,
      poster: null,
      language: movie.language || ''
    });
    axios.get(`http://localhost:8081/api/shows/movie/${movie.id}/details`)
      .then(res => {
        setShows(res.data.map(show => ({
          date: show.showtime ? new Date(show.showtime).toISOString().split('T')[0] : '',
          time: show.showtime ? new Date(show.showtime).toTimeString().split(' ')[0].slice(0, 5) : '',
          theaterId: show.theater?.id || '',
          price: show.price || '',
          id: show.id
        })));
      })
      .catch(err => console.error('Error fetching shows:', err));
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm(prev => ({
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

  const handleUpdateMovie = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', editForm.title);
    formData.append('description', editForm.description);
    formData.append('duration', editForm.duration);
    formData.append('language', editForm.language);
    if (editForm.poster) {
      formData.append('poster', editForm.poster);
    }
    shows.forEach((show, index) => {
      formData.append(`showIds`, show.id || '');
      formData.append(`showDates`, show.date);
      formData.append(`showTimes`, show.time);
      formData.append(`theaterIds`, show.theaterId);
      formData.append(`prices`, show.price);
    });

    axios.put(`http://localhost:8081/api/movies/${editingMovie.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
      setMessage(res.data);
      setEditingMovie(null);
      setShows([{ date: '', time: '', theaterId: '', price: '', id: null }]);
      fetchMovies();
    }).catch(err => setMessage('Error: ' + (err.response?.data || err.message)));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      axios.delete(`http://localhost:8081/api/movies/${id}`).then(res => {
        setMessage(res.data);
        fetchMovies();
      }).catch(err => setMessage('Error: ' + (err.response?.data || err.message)));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <nav style={{ backgroundColor: '#333', padding: '10px', marginBottom: '20px' }}>
        <Link to="/admin-dashboard" style={{ color: 'white', marginRight: '20px' }}>Add Movie</Link>
        <Link to="/admin-movies" style={{ color: 'white' }}>Added Movies</Link>
      </nav>
      <h2>Added Movies</h2>
      <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '8px', marginBottom: '20px' }}>
        <option value="All">All</option>
        <option value="Tamil">Tamil</option>
        <option value="Malayalam">Malayalam</option>
        <option value="Kannada">Kannada</option>
        <option value="Hindi">Hindi</option>
        <option value="Telugu">Telugu</option>
        <option value="English">English</option>
      </select>
      <div className="movie-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {movies.filter(movie => filter === 'All' || movie.language === filter).map(movie => (
          <div key={movie.id} className="movie-card" style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
            <img src={`http://localhost:8081${movie.posterPath}`} alt={movie.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <h4>{movie.title}</h4>
            <p>{movie.duration}</p>
            <button onClick={() => handleEdit(movie)} style={{ backgroundColor: '#007bff', color: 'white', margin: '5px', padding: '5px' }}>Edit</button>
            <button onClick={() => handleDelete(movie.id)} style={{ backgroundColor: '#dc3545', color: 'white', margin: '5px', padding: '5px' }}>Delete</button>
          </div>
        ))}
      </div>

      {editingMovie && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', border: '1px solid #ccc', zIndex: 1000, maxHeight: '80vh', overflowY: 'auto' }}>
          <h3>Edit Movie: {editingMovie.title}</h3>
          <form onSubmit={handleUpdateMovie}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={editForm.title}
              onChange={handleEditChange}
              style={{ width: '100%', padding: '8px', margin: '10px 0' }}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={editForm.description}
              onChange={handleEditChange}
              style={{ width: '100%', padding: '8px', margin: '10px 0', height: '80px' }}
              required
            />
            <input
              type="text"
              name="duration"
              placeholder="Duration"
              value={editForm.duration}
              onChange={handleEditChange}
              style={{ width: '100%', padding: '8px', margin: '10px 0' }}
              required
            />
            <select
              name="language"
              value={editForm.language}
              onChange={handleEditChange}
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
              onChange={handleEditChange}
              style={{ width: '100%', padding: '8px', margin: '10px 0' }}
            />
            <h4>Edit Shows</h4>
            {shows.map((show, index) => (
              <div key={index} style={{ marginBottom: '10px', border: '1px solid #ddd', padding: '10px' }}>
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
            <button type="button" onClick={addShowField} style={{ backgroundColor: '#007bff', color: 'white', padding: '5px', margin: '10px 0' }}>Add Show</button>
            <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', padding: '10px', margin: '10px 5px 0 0' }}>Update</button>
            <button type="button" onClick={() => setEditingMovie(null)} style={{ backgroundColor: '#6c757d', color: 'white', padding: '10px', margin: '10px 0 0 5px' }}>Cancel</button>
          </form>
          {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default AddedMovies;