import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder, getProfile } from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, upi, card
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('processing'); // processing, success, failed
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: ''
  });

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    if (cart.items.length === 0) {
      alert('Your cart is empty');
      navigate('/products');
      return;
    }

    // Validate payment method details
    if (paymentMethod === 'upi' && !paymentDetails.upiId) {
      alert('Please enter your UPI ID');
      return;
    }

    if (paymentMethod === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.cardName || !paymentDetails.cardExpiry || !paymentDetails.cardCVV) {
        alert('Please fill in all card details');
        return;
      }
    }

    // For UPI and Card payments, show payment modal
    if (paymentMethod === 'upi' || paymentMethod === 'card') {
      setShowPaymentModal(true);
      setPaymentStatus('pending'); // User needs to confirm payment
    } else {
      // COD - process order directly
      processOrder();
    }
  };

  const handlePaymentConfirm = () => {
    setPaymentStatus('processing');
    
    // Simulate payment processing (3 seconds)
    setTimeout(() => {
      setPaymentStatus('success');
      
      // After showing success, process the order
      setTimeout(() => {
        setShowPaymentModal(false);
        processOrder();
      }, 2000);
    }, 3000);
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setPaymentStatus('pending');
  };

  const processOrder = async () => {
    setLoading(true);

    try {
      const addressString = `${shippingAddress.fullName}, ${shippingAddress.phone}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.zipCode}`;
      
      const orderData = {
        items: cart.items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        shipping_address: addressString,
        payment_method: paymentMethod.toUpperCase()
      };

      const response = await createOrder(orderData);
      setOrderId(response.data.id);
      setOrderPlaced(true);
      clearCart();
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-2">Your order #{orderId} has been placed successfully.</p>
          <p className="text-gray-600 mb-8">Thank you for shopping with us!</p>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/products')}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => navigate('/orders')}
              className="flex-1 bg-flipkart-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to your cart before checkout</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-flipkart-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Address Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Shipping Address</h2>
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flipkart-blue focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flipkart-blue focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    rows="3"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flipkart-blue focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flipkart-blue focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flipkart-blue focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flipkart-blue focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Payment Method Section */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Payment Method</h3>
                  
                  <div className="space-y-3">
                    {/* Cash on Delivery */}
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-flipkart-blue" style={{ borderColor: paymentMethod === 'cod' ? '#2874f0' : '#e5e7eb' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-flipkart-blue"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="font-semibold text-gray-800">Cash on Delivery</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Pay when you receive the product</p>
                      </div>
                    </label>

                    {/* UPI Payment */}
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-flipkart-blue" style={{ borderColor: paymentMethod === 'upi' ? '#2874f0' : '#e5e7eb' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-flipkart-blue"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span className="font-semibold text-gray-800">UPI Payment</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Pay using Google Pay, PhonePe, Paytm</p>
                      </div>
                    </label>

                    {paymentMethod === 'upi' && (
                      <div className="ml-4 mt-2">
                        <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-2">
                          UPI ID *
                        </label>
                        <input
                          type="text"
                          id="upiId"
                          name="upiId"
                          value={paymentDetails.upiId}
                          onChange={handlePaymentChange}
                          placeholder=""
                          required={paymentMethod === 'upi'}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flipkart-blue focus:border-transparent"
                        />
                      </div>
                    )}

                    {/* Card Payment */}
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-flipkart-blue" style={{ borderColor: paymentMethod === 'card' ? '#2874f0' : '#e5e7eb' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-flipkart-blue"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <span className="font-semibold text-gray-800">Credit / Debit Card</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Visa, Mastercard, RuPay accepted</p>
                      </div>
                    </label>

                    {paymentMethod === 'card' && (
                      <div className="ml-4 mt-2 space-y-4">
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={paymentDetails.cardNumber}
                            onChange={handlePaymentChange}
                            placeholder=""
                            maxLength="16"
                            required={paymentMethod === 'card'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flipkart-blue focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            value={paymentDetails.cardName}
                            onChange={handlePaymentChange}
                            placeholder=""
                            required={paymentMethod === 'card'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flipkart-blue focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-2">
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              id="cardExpiry"
                              name="cardExpiry"
                              value={paymentDetails.cardExpiry}
                              onChange={handlePaymentChange}
                              placeholder=""
                              maxLength="5"
                              required={paymentMethod === 'card'}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flipkart-blue focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label htmlFor="cardCVV" className="block text-sm font-medium text-gray-700 mb-2">
                              CVV *
                            </label>
                            <input
                              type="text"
                              id="cardCVV"
                              name="cardCVV"
                              value={paymentDetails.cardCVV}
                              onChange={handlePaymentChange}
                              placeholder=""
                              maxLength="3"
                              required={paymentMethod === 'card'}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flipkart-blue focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-yellow-400 text-flipkart-dark px-6 py-3 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.items.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img 
                      src={item.image_url || `https://via.placeholder.com/60x60/2874f0/ffffff?text=${encodeURIComponent(item.name.substring(0, 5))}`} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/60x60/2874f0/ffffff?text=${encodeURIComponent(item.name.substring(0, 5))}`;
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-flipkart-blue">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 pt-2">
                  <span>Total</span>
                  <span className="text-flipkart-blue">₹{getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Payment Method</h3>
                <div className="flex items-center gap-2">
                  {paymentMethod === 'cod' && (
                    <>
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-gray-700">Cash on Delivery</span>
                    </>
                  )}
                  {paymentMethod === 'upi' && (
                    <>
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">UPI Payment</span>
                    </>
                  )}
                  {paymentMethod === 'card' && (
                    <>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="text-gray-700">Credit / Debit Card</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Processing Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            
            {/* Pending - User needs to confirm payment */}
            {paymentStatus === 'pending' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {paymentMethod === 'upi' && (
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                  {paymentMethod === 'card' && (
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Confirm Payment</h3>
                <p className="text-gray-600 mb-6">
                  {paymentMethod === 'upi' && 'Scan QR code or confirm UPI payment'}
                  {paymentMethod === 'card' && 'Please confirm your card payment'}
                </p>
                
                {/* UPI QR Code Section */}
                {paymentMethod === 'upi' && (
                  <div className="mb-6">
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <div className="bg-gray-100 p-4 rounded">
                        <div className="text-6xl">📱</div>
                        <div className="text-xs text-gray-500 mt-2">UPI QR Code</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      Open Paytm/PhonePe/Google Pay and scan
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-2xl">📱</span>
                      <span className="text-sm font-semibold text-purple-600">PhonePe</span>
                      <span className="text-sm text-gray-400">|</span>
                      <span className="text-2xl">💳</span>
                      <span className="text-sm font-semibold text-blue-600">Paytm</span>
                      <span className="text-sm text-gray-400">|</span>
                      <span className="text-2xl">🔵</span>
                      <span className="text-sm font-semibold text-green-600">Google Pay</span>
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <div className="flex justify-between text-lg mb-4 pb-4">
                    <span className="text-gray-700 font-medium">Amount to Pay</span>
                    <span className="font-bold text-flipkart-blue text-xl">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  
                  {paymentMethod === 'upi' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="font-semibold text-gray-800">UPI</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">UPI ID</span>
                        <span className="font-semibold text-gray-800">{paymentDetails.upiId}</span>
                      </div>
                      <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                        <p className="text-xs text-blue-800 font-semibold mb-1">💡 Testing Mode</p>
                        <p className="text-xs text-blue-700">This is a demo. Click "Pay Now" to simulate payment.</p>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === 'card' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="font-semibold text-gray-800">Card</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Card Number</span>
                        <span className="font-semibold text-gray-800">**** **** **** {paymentDetails.cardNumber.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cardholder</span>
                        <span className="font-semibold text-gray-800">{paymentDetails.cardName}</span>
                      </div>
                      <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                        <p className="text-xs text-blue-800 font-semibold mb-1">💡 Testing Mode</p>
                        <p className="text-xs text-blue-700">This is a demo. Click "Pay Now" to simulate payment.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-yellow-800">
                    ⚠️ <strong>Localhost Demo:</strong> No real money will be charged. 
                    For production, integrate Razorpay/Paytm gateway.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePaymentCancel}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePaymentConfirm}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Pay Now
                  </button>
                </div>
              </div>
            )}

            {/* Processing */}
            {paymentStatus === 'processing' && (
              <div className="text-center">
                <div className="w-20 h-20 border-4 border-flipkart-blue border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h3>
                <p className="text-gray-600 mb-4">
                  {paymentMethod === 'upi' && `Waiting for UPI payment confirmation...`}
                  {paymentMethod === 'card' && `Processing your card payment...`}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-semibold text-gray-800">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  {paymentMethod === 'upi' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">UPI ID</span>
                      <span className="font-semibold text-gray-800">{paymentDetails.upiId}</span>
                    </div>
                  )}
                  {paymentMethod === 'card' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Card</span>
                      <span className="font-semibold text-gray-800">****{paymentDetails.cardNumber.slice(-4)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">₹{getCartTotal().toFixed(2)} paid successfully</p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">Processing your order...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
