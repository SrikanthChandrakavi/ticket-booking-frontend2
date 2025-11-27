import { useEffect, useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ title: '', description: '', duration: 0, posterUrl: '' });

  useEffect(() => {
    axios.get('http://localhost:8081/api/movies').then(res => setMovies(res.data));
  }, []);

  const addMovie = () => {
    axios.post('http://localhost:8081/api/admin/movies', newMovie).then(res => {
      setMovies([...movies, res.data]);
      setNewMovie({ title: '', description: '', duration: 0, posterUrl: '' });
    });
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Login: admin/admin (via Basic Auth in browser)</p>
      <h3>Add Movie</h3>
      <input placeholder="Title" onChange={e => setNewMovie({...newMovie, title: e.target.value})} />
      <input placeholder="Description" onChange={e => setNewMovie({...newMovie, description: e.target.value})} />
      <input type="number" placeholder="Duration" onChange={e => setNewMovie({...newMovie, duration: e.target.value})} />
      <input placeholder="Poster URL" onChange={e => setNewMovie({...newMovie, posterUrl: e.target.value})} />
      <button onClick={addMovie}>Add</button>

      <h3>Movies (Sales Monitor Placeholder)</h3>
      {movies.map(m => <p key={m.id}>{m.title}</p>)}
    </div>
  );
};

export default Admin;