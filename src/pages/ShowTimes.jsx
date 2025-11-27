import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ShowTimes = () => {
  const { id } = useParams(); // movieId from the URL
  const [shows, setShows] = useState([]);
  const [availableSeats, setAvailableSeats] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8081/api/shows/movie/${id}`)
      .then(res => {
        console.log('Raw API response for movie ID', id, ':', res.data); // Debug raw response
        let showData = res.data;
        if (!Array.isArray(showData)) {
          if (showData && typeof showData === 'object' && showData.shows) {
            // If the response is an object with a 'shows' array
            showData = showData.shows;
          } else if (showData) {
            // If it's a single object, wrap it in an array
            showData = [showData];
          } else {
            showData = [];
          }
        }
        console.log('Processed show data for movie ID', id, ':', showData);
        setShows(showData || []);

        const seatPromises = showData.map(show =>
          axios.get(`http://localhost:8081/api/shows/${show.id}/seats`)
            .then(seatRes => ({ id: show.id, seats: seatRes.data }))
            .catch(err => {
              console.error('Error fetching seats for show', show.id, err);
              return { id: show.id, seats: [] };
            })
        );
        Promise.all(seatPromises).then(results => {
          const seatsMap = results.reduce((acc, { id, seats }) => ({
            ...acc,
            [id]: seats || []
          }), {});
          setAvailableSeats(seatsMap);
        });
      })
      .catch(err => {
        console.error('Error fetching shows for movie ID', id, ':', err);
        setMessage('Error fetching shows: ' + (err.response?.data || err.message));
      })
      .finally(() => setLoading(false));
  }, [id]);

  console.log('Rendering ShowTimes for movie ID:', id); // Debug log

  if (loading) return <p>Loading showtimes...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Showtimes for Movie ID: {id}</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Time</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Theater</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Available Seats</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {shows.length > 0 ? (
            shows.map(show => (
              <tr key={show.id} style={{ border: '1px solid #ddd' }}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {show.showtime ? new Date(show.showtime).toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {show.showtime ? new Date(show.showtime).toLocaleTimeString() : 'N/A'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {show.theater?.name || 'N/A'} ({show.theater?.location || 'N/A'})
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>${show.price || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {availableSeats[show.id]?.length > 0 ? availableSeats[show.id].join(', ') : 'None'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <Link to={`/booking/${show.id}`}><button style={{ backgroundColor: '#ff6200', color: 'white', padding: '5px 10px' }}>Book Now</button></Link>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6" style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>No shows available. Contact admin to add shows.</td></tr>
          )}
        </tbody>
      </table>
      <Link to="/" style={{ display: 'block', marginTop: '20px', color: '#ff6200' }}>Back to Home</Link>
    </div>
  );
};

export default ShowTimes;