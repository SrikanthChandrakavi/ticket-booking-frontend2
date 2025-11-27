import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get('http://localhost:8081/api/movies').then(res => {
      console.log('Movies fetched:', res.data);
      setMovies(res.data);
    }).catch(err => console.error('Error fetching movies:', err));
  }, []);

  const handleFilter = (type) => {
    setFilter(type);
  };

  const handleBookNow = (movieId) => {
    console.log('Redirecting to showtimes for movieId:', movieId); // Debug log
    if (userId) {
      navigate(`/showtimes/${movieId}`);
    } else {
      navigate('/login');
    }
  };

  const filteredMovies = movies.filter(movie => filter === 'all' || !filter || filter === movie.language);

  return (
    <div>
      <div className="filters">
        <button onClick={() => handleFilter('all')}>All</button>
        <button onClick={() => handleFilter('Tamil')}>Tamil</button>
        <button onClick={() => handleFilter('Malayalam')}>Malayalam</button>
        <button onClick={() => handleFilter('Kannada')}>Kannada</button>
        <button onClick={() => handleFilter('Hindi')}>Hindi</button>
        <button onClick={() => handleFilter('Telugu')}>Telugu</button>
        <button onClick={() => handleFilter('English')}>English</button>
      </div>
      <h2>Now Showing</h2>
      <div className="movie-list">
        {filteredMovies.map(movie => (
          <div key={movie.id} className="movie-card">
            <img
              src={`http://localhost:8081${movie.posterPath}`}
              alt={movie.title}
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300'; console.log('Image load failed for:', movie.posterPath); }}
            />
            <h3>{movie.title}</h3>
            <button onClick={() => handleBookNow(movie.id)} style={{ backgroundColor: '#ff6200', color: 'white', padding: '10px' }}>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;