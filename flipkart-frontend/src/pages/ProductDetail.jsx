import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProduct } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id);
        setProduct(response.data);
        setReviews([
          {
            id: 1,
            user: 'Rahul Kumar',
            rating: 5,
            comment: 'Excellent product! Highly recommended. Great quality and fast delivery.',
            date: '2025-01-15',
            helpful: 24
          },
          {
            id: 2,
            user: 'Priya Sharma',
            rating: 4,
            comment: 'Good product, value for money. Packaging could be better.',
            date: '2025-01-10',
            helpful: 12
          },
          {
            id: 3,
            user: 'Amit Singh',
            rating: 5,
            comment: 'Amazing quality! Exactly as described. Will buy again.',
            date: '2025-01-05',
            helpful: 8
          }
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      navigate('/cart');
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newReview.comment.trim()) {
      const review = {
        id: reviews.length + 1,
        user: 'Current User',
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0],
        helpful: 0
      };
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      alert('Review submitted successfully!');
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Product not found</div>
      </div>
    );
  }

  const isInStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={product.image_url || `https://via.placeholder.com/500x500/2874f0/ffffff?text=${encodeURIComponent(product.name.substring(0, 30))}`} 
                  alt={product.name}
                  className="w-full h-96 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/500x500/2874f0/ffffff?text=${encodeURIComponent(product.name.substring(0, 30))}`;
                  }}
                />
              </div>
              <div className="flex gap-4 lg:hidden">
                <button 
                  onClick={handleAddToCart} 
                  disabled={!isInStock}
                  className="flex-1 bg-yellow-400 text-flipkart-dark px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
                <button 
                  onClick={handleBuyNow} 
                  disabled={!isInStock}
                  className="flex-1 bg-flipkart-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-sm text-gray-600">
                <span onClick={() => navigate('/')} className="hover:text-flipkart-blue cursor-pointer">Home</span>
                <span className="mx-2">/</span>
                <span onClick={() => navigate('/products')} className="hover:text-flipkart-blue cursor-pointer">Products</span>
                <span className="mx-2">/</span>
                <span className="text-gray-800 font-medium">{product.name}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
              
              <div>
                <span className="inline-block bg-flipkart-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.category_name}
                </span>
              </div>

              <div className="py-4">
                <div className="text-4xl font-bold text-flipkart-blue mb-1">
                  ₹{product.price}
                </div>
                <div className="text-sm text-gray-600">Inclusive of all taxes</div>
              </div>

              <div>
                {isInStock ? (
                  <span className="inline-flex items-center text-green-600 font-semibold">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center text-red-600 font-semibold">
                    Out of Stock
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Product Details</h3>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="py-3 text-gray-600 font-medium">Category</td>
                      <td className="py-3 text-gray-800">{product.category_name}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-600 font-medium">Price</td>
                      <td className="py-3 text-gray-800">₹{product.price}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-600 font-medium">Availability</td>
                      <td className="py-3 text-gray-800">{isInStock ? 'In Stock' : 'Out of Stock'}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-600 font-medium">Stock Quantity</td>
                      <td className="py-3 text-gray-800">{product.stock} units</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {isInStock && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleQuantityChange(-1)} 
                      disabled={quantity <= 1}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 rounded-full transition-colors duration-200 flex items-center justify-center font-semibold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)} 
                      disabled={quantity >= product.stock}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 rounded-full transition-colors duration-200 flex items-center justify-center font-semibold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="hidden lg:flex gap-4">
                <button 
                  onClick={handleAddToCart} 
                  disabled={!isInStock}
                  className="flex-1 bg-yellow-400 text-flipkart-dark px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
                <button 
                  onClick={handleBuyNow} 
                  disabled={!isInStock}
                  className="flex-1 bg-flipkart-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  Buy Now
                </button>
              </div>

              {addedToCart && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  ✓ {quantity} item(s) added to cart successfully!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mt-8 p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Ratings & Reviews</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-flipkart-blue mb-2">
                {calculateAverageRating()}
                <span className="text-2xl text-gray-600">/5</span>
              </div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.round(calculateAverageRating())
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">{reviews.length} Ratings</p>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-semibold mb-4 text-gray-800">Rating Distribution</h3>
              {[5, 4, 3, 2, 1].map(star => {
                const distribution = getRatingDistribution();
                const count = distribution[star];
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-gray-700 w-8">{star}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            {!showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-flipkart-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Write Your Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="focus:outline-none"
                      >
                        <svg
                          className={`w-8 h-8 ${
                            star <= newReview.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          } hover:text-yellow-400 transition-colors`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Your Review</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder=""
                    rows="4"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flipkart-blue focus:border-transparent"
                  ></textarea>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-flipkart-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="pb-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-flipkart-blue text-white rounded-full flex items-center justify-center font-bold">
                          {review.user.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{review.user}</h4>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded">
                      <span className="font-semibold">{review.rating}</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <button className="hover:text-flipkart-blue transition-colors flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;