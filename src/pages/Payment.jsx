import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import QRCode from 'qrcode';

const stripePromise = loadStripe('pk_test_your_publishable_key'); // Replace with your publishable key

const PaymentForm = ({ showId, totalPrice, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [upiQR, setUpiQR] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedPaymentMethod === 'upi') {
      generateUPIQR();
    }
  }, [selectedPaymentMethod]);

  const generateUPIQR = async () => {
    try {
      const upiUrl = `upi://pay?pa=yourupi@paytm&pn=Movie%20Theater&am=${totalPrice}&cu=INR&tn=Movie%20Ticket%20Payment`;
      const qrDataUrl = await QRCode.toDataURL(upiUrl);
      setUpiQR(qrDataUrl);
    } catch (err) {
      setMessage('Error generating QR code: ' + err.message);
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      if (selectedPaymentMethod === 'card') {
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: { name: 'User Name' }, // Replace with user data
          },
        });
        if (result.error) {
          setMessage(result.error.message);
        } else {
          setMessage('Payment successful!');
          navigate('/');
        }
      } else if (selectedPaymentMethod === 'upi') {
        // Simulate UPI payment (integrate with UPI SDK for real flow)
        setTimeout(() => {
          setMessage('UPI payment simulated successfully!');
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setMessage('Payment failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Payment for Show ID: {showId}</h2>
      <p>Total Amount: ₹{totalPrice}</p>
      <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px' }}>
        <h3>Payment Options</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setSelectedPaymentMethod('card')} style={{ backgroundColor: selectedPaymentMethod === 'card' ? '#007bff' : '#f8f9fa', padding: '10px' }}>
            Debit/Credit Card
          </button>
          <button onClick={() => setSelectedPaymentMethod('upi')} style={{ backgroundColor: selectedPaymentMethod === 'upi' ? '#007bff' : '#f8f9fa', padding: '10px' }}>
            UPI QR
          </button>
          {/* Add other methods as needed (e.g., Google Pay) with mock handling */}
        </div>
      </div>
      {selectedPaymentMethod === 'card' && <CardElement />}
      {selectedPaymentMethod === 'upi' && upiQR && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3>Scan QR Code to Pay</h3>
          <img src={upiQR} alt="UPI QR Code" style={{ width: '200px', height: '200px' }} />
          <p>Amount: ₹{totalPrice}</p>
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={loading || (selectedPaymentMethod === 'card' && !stripe)}
        style={{ backgroundColor: '#ff6200', color: 'white', padding: '15px', border: 'none', cursor: 'pointer' }}
      >
        {loading ? 'Processing Payment...' : 'Pay Now'}
      </button>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <Link to={`/booking/${showId}`} style={{ display: 'block', marginTop: '20px', color: '#ff6200' }}>Back to Seat Selection</Link>
    </div>
  );
};

const Payment = () => {
  const { showId, totalPrice, clientSecret } = useParams();
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm showId={showId} totalPrice={totalPrice} clientSecret={clientSecret} />
    </Elements>
  );
};

export default Payment;