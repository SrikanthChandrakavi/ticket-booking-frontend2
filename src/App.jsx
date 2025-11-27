import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import BookingForm from './pages/BookingForm';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AddedMovies from './pages/AddedMovies';
import Showtimes from './pages/ShowTimes';
import Payment from './pages/Payment'; // New import
import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="header">
          <h1>Online Movie Ticket Booking</h1>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/booking/:showId" element={<BookingForm />} />
          <Route path="/payment/:showId/:totalPrice" element={<Payment />} /> {/* New route */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-movies" element={<AddedMovies />} />
          <Route path="/showtimes/:id" element={<Showtimes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;