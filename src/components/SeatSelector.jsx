import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SeatSelector = ({ onSelectSeats, bookedSeats, selectedSeats }) => {
  const { showId } = useParams();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8081/api/shows/${showId}/seats`)
      .then(res => {
        const fetchedSeats = res.data || [];
        console.log('Fetched seats:', fetchedSeats); // Debug API response
        const initialSeats = Array(5)
          .fill()
          .map((_, row) =>
            Array(10)
              .fill()
              .map((_, col) => {
                const rowLetter = String.fromCharCode(65 + row); // A, B, C, ...
                const seatNumber = col + 1; // 1, 2, 3, ...
                const seatId = `${rowLetter}${seatNumber}`; // e.g., A1, A2, B1, B2
                const fetchedSeat = fetchedSeats.find(s => s.seatNumber === seatId);
                const isBooked = bookedSeats.includes(seatId) || (fetchedSeat && fetchedSeat.status === 'BOOKED');
                return {
                  id: seatId,
                  seatNumber: seatId,
                  row: rowLetter,
                  number: seatNumber,
                  isBooked,
                  isSelected: selectedSeats.includes(seatId),
                };
              })
          )
          .flat();
        setSeats(initialSeats);
        console.log('Initialized seats:', initialSeats); // Debug initialized seats
      })
      .catch(err => {
        console.error('Error fetching seats:', err);
        setSeats([]);
      })
      .finally(() => setLoading(false));
  }, [showId, bookedSeats, selectedSeats]);

  const toggleSeat = (seat) => {
    console.log('Toggling seat:', seat); // Debug click event
    if (!seat.isBooked) {
      const newSelected = selectedSeats.includes(seat.seatNumber)
        ? selectedSeats.filter(s => s !== seat.seatNumber)
        : [...selectedSeats, seat.seatNumber];
      console.log('New selected seats:', newSelected); // Debug selection state
      onSelectSeats(newSelected);
    } else {
      console.log('Seat is booked, cannot select:', seat.seatNumber);
    }
  };

  if (loading) return <p>Loading seats...</p>;

  return (
    <div>
      <h3>Select Seats</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 40px)', gap: '5px', marginBottom: '20px' }}>
        {seats.map(seat => (
          <button
            key={seat.seatNumber}
            onClick={() => toggleSeat(seat)}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: seat.isBooked ? '#ccc' : selectedSeats.includes(seat.seatNumber) ? '#28a745' : '#007bff',
              color: 'white',
              border: 'none',
              cursor: seat.isBooked ? 'not-allowed' : 'pointer',
              textDecoration: seat.isBooked ? 'line-through' : 'none',
            }}
            disabled={seat.isBooked}
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeatSelector;