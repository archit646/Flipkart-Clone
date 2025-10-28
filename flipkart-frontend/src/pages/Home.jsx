import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import { getCategories } from '../services/api';

function Home() {
  const navigate = useNavigate();
  // State for categories and loading
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category icons mapping
  const categoryIcons = {
    'Electronics': '📱',
    'Fashion': '👗',
    'Home & Kitchen': '🏠',
    'Books': '📚',
    'Sports': '⚽',
    'Toys': '🎮',
    'Beauty': '💄',
    'Food': '🍔',
    'default': '📦'
  };

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.log('error getting categories:', error);
      setLoading(false);
    }
  };

  // Navigate to products with category filter
  function handleCategoryClick(categoryId) {
    navigate(`/products?category=${categoryId}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-8">
        <Carousel />
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Shop by Category</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-flipkart-blue"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No categories available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {categories.map((category) => {
              let icon = categoryIcons[category.name];
              if(!icon) icon = categoryIcons['default'];
              
              return (
              <div 
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl cursor-pointer text-center"
              >
                <div className="text-5xl mb-3">
                  {icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-flipkart-blue">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                )}
                <div className="mt-4 text-flipkart-blue font-semibold text-sm">Browse →</div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Flipkart Clone</h1>
          <p className="text-lg md:text-xl mb-8">Shop the best products at the best prices</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-yellow-400 text-flipkart-dark px-8 py-3 rounded-lg font-semibold text-lg hover:bg-yellow-500 shadow-lg"
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;