import { useEffect, useState } from 'react';
import axios from 'axios';

const MovieList = ({ onSelectMovie }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/api/movies').then(res => setMovies(res.data));
  }, []);

  return (
    <div>
      <h2>Movies</h2>
      {movies.map(movie => (
        <div key={movie.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{movie.title}</h3>
          <p>{movie.description}</p>
          <img src={movie.posterUrl} alt={movie.title} width="200" />
          <button onClick={() => onSelectMovie(movie.id)}>View Shows</button>
        </div>
      ))}
    </div>
  );
};

export default MovieList;   