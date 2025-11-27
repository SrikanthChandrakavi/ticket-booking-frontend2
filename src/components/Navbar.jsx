import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <nav>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        {username ? (
          <>
            <Link to="/profile" style={{ color: '#ff6200', textDecoration: 'underline', marginRight: '10px' }}>
              {username}
            </Link>
            <button onClick={handleLogout} className="signup-btn" style={{ marginRight: '10px' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="signup-btn" style={{ marginRight: '10px' }}>Login</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;