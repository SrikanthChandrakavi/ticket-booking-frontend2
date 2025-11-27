import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SeatSelector from '../components/SeatSelector'; // Adjust path as needed

const BookingForm = () => {
  const { showId } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]); // Track booked seats
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPrice, setShowPrice] = useState(0); // Store the price per ticket
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8081/api/shows/${showId}`)
      .then(res => {
        console.log('Show details response:', res.data);
        const price = res.data.price;
        if (price === undefined || price === null || isNaN(price)) {
          setMessage('Invalid or missing price. Using fallback: 12.50');
          setShowPrice(12.50);
        } else {
          setShowPrice(Number(price));
        }
        // Fetch initial booked seats
        axios.get(`http://localhost:8081/api/shows/${showId}/seats`)
          .then(seatRes => {
            const fetchedBookedSeats = seatRes.data
              .filter(seat => seat.status === 'BOOKED')
              .map(seat => seat.seatNumber); // Use seatNumber instead of id
            setBookedSeats(fetchedBookedSeats);
          })
          .catch(seatErr => console.error('Error fetching booked seats:', seatErr));
      })
      .catch(err => {
        console.error('Error fetching show details:', err);
        setMessage('Error loading price: ' + err.message);
        setShowPrice(12.50);
      })
      .finally(() => setLoading(false));
  }, [showId]);

  const handleBook = async () => {
    if (selectedSeats.length === 0) {
      setMessage('Please select at least one seat.');
      return;
    }
    setLoading(true);
    try {
      // Book seats via API
      await axios.post(`http://localhost:8081/api/movies/${showId}/book`, selectedSeats);
      setBookedSeats(prevBookedSeats => [...prevBookedSeats, ...selectedSeats]);
      setSelectedSeats([]);
      setMessage('Payment completed successfully! Seats booked.');
    } catch (err) {
      console.error('Error booking seats:', err);
      setMessage('Error booking seats: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = selectedSeats.length * showPrice;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Seat Selection for Show ID: {showId}</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <div style={{ textAlign: 'center', backgroundColor: '#000', color: '#fff', padding: '20px', marginBottom: '20px', borderRadius: '5px' }}>
        <h3>All eyes this way please</h3>
      </div>
      <SeatSelector
        onSelectSeats={setSelectedSeats}
        bookedSeats={bookedSeats} // Pass booked seats to SeatSelector
        selectedSeats={selectedSeats} // Pass selected seats
      />
      <p>Selected Seats: {selectedSeats.join(', ')} | Price per Ticket: ₹{showPrice.toFixed(2)} | Total: ₹{totalPrice.toFixed(2)}</p>
      <button
        onClick={handleBook}
        disabled={loading || selectedSeats.length === 0}
        style={{ backgroundColor: '#ff6200', color: 'white', padding: '10px' }}
      >
        {loading ? 'Processing...' : 'Confirm & Pay'}
      </button>
      <a href="/showtimes" style={{ display: 'block', marginTop: '20px', color: '#ff6200' }}>Back to Showtimes</a>
    </div>
  );
};

export default BookingForm;