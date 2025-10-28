import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    updateQuantity(itemId, newQuantity);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Shopping Cart</h1>
        {cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <button 
              onClick={() => navigate('/products')}
              className="bg-flipkart-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex items-center gap-6">
                  <img 
                    src={item.image_url || `https://via.placeholder.com/100x100/2874f0/ffffff?text=${encodeURIComponent(item.name.substring(0, 10))}`} 
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/100x100/2874f0/ffffff?text=${encodeURIComponent(item.name.substring(0, 10))}`;
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-xl font-bold text-flipkart-blue">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded-full transition-colors duration-200 flex items-center justify-center font-semibold"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded-full transition-colors duration-200 flex items-center justify-center font-semibold"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
                <div className="pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-flipkart-blue">₹{getCartTotal()}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-yellow-400 text-flipkart-dark py-3 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-colors duration-200 shadow-md"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;