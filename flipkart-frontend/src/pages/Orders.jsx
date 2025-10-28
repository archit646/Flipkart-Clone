import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, cancelOrder } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await getOrders();
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // cancel order function
  const handleCancelOrder = async (orderId) => {
    // confirm before cancelling
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancellingOrderId(orderId);
    
    try {
      await cancelOrder(orderId);
      
      // update orders list
      setOrders(orders.filter(order => order.id !== orderId));
      
      alert('Order cancelled successfully!');
    } catch (error) {
      console.log('error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-orange-500',
      processing: 'bg-blue-500',
      shipped: 'bg-purple-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-8">You haven't placed any orders yet</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-flipkart-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">My Orders</h1>
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Order #{order.id}</h3>
                    <p className="text-gray-600">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span 
                    className={`${getStatusColor(order.status)} text-white px-4 py-2 rounded-full font-semibold text-sm`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {order.items && order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <img 
                        src={item.product?.image_url || `https://via.placeholder.com/80x80/2874f0/ffffff?text=Product`} 
                        alt={item.product?.name || 'Product'}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/80x80/2874f0/ffffff?text=Product`;
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.product?.name || 'Product'}</h4>
                        <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                        <p className="font-bold text-flipkart-blue">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Shipping Address:</h4>
                    <p className="text-gray-600">{order.shipping_address}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <h4 className="font-semibold text-gray-800 mb-2">Total Amount:</h4>
                    <p className="text-3xl font-bold text-flipkart-blue">₹{order.total_amount}</p>
                  </div>
                </div>
                
                {/* Cancel button - only show if order is pending */}
                {order.status === 'pending' && (
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancellingOrderId === order.id}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
