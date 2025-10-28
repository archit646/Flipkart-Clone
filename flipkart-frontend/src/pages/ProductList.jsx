import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProducts, getCategories } from '../services/api';

function ProductList() {
  // State management
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Load products on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle category filter from URL
  useEffect(() => {
    const categoryId = searchParams.get('category');
    if(categoryId) {
      const catId = parseInt(categoryId);
      setSelectedCategory(catId);
      filterProductsByCategory(catId);
    }
    else {
      setSelectedCategory(null);
      setProducts(allProducts);
    }
  }, [searchParams, allProducts]);

  // Fetch products and categories from API
  const fetchData = async () => {
    try {
      const productsResponse = await getProducts();
      const categoriesResponse = await getCategories();
      
      setAllProducts(productsResponse.data);
      setProducts(productsResponse.data);
      setCategories(categoriesResponse.data);
      setLoading(false);
    } catch (error) {
      console.log('error:', error);
      setLoading(false);
    }
  };

  // Filter products by category ID
  const filterProductsByCategory = (categoryId) => {
    if(categoryId) {
      let filtered = [];
      for(let i = 0; i < allProducts.length; i++) {
        if(allProducts[i].category === categoryId) {
          filtered.push(allProducts[i]);
        }
      }
      setProducts(filtered);
    } else{
      setProducts(allProducts);
    }
  };

  // Handle category button click
  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    
    if(categoryId === null) {
      setProducts(allProducts);
      navigate('/products', { replace: true });
    }
    else {
      let filtered = [];
      for(let i=0; i<allProducts.length; i++){
        if(allProducts[i].category === categoryId){
          filtered.push(allProducts[i]);
        }
      }
      setProducts(filtered);
      navigate(`/products?category=${categoryId}`, { replace: true });
    }
  };

  // Add product to cart
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  // Navigate to product detail page
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if(loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading products...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Products</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter by Category</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategoryFilter(null)}
              className={selectedCategory === null ? 'px-6 py-2 rounded-full font-semibold bg-flipkart-blue text-white shadow-lg' : 'px-6 py-2 rounded-full font-semibold bg-white text-gray-700 hover:border-flipkart-blue hover:text-flipkart-blue'}
            >
              All Products ({allProducts.length})
            </button>
            {categories.map(category => {
              let count = 0;
              for(let i=0; i<allProducts.length; i++){
                if(allProducts[i].category === category.id) count++;
              }
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={selectedCategory === category.id ? 'px-6 py-2 rounded-full font-semibold bg-flipkart-blue text-white shadow-lg' : 'px-6 py-2 rounded-full font-semibold bg-white text-gray-700 hover:border-flipkart-blue hover:text-flipkart-blue'}
                >
                  {category.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-xl cursor-pointer overflow-hidden"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="w-full overflow-hidden bg-gray-100">
                <img 
                  src={product.image_url || 'https://via.placeholder.com/300x300/2874f0/ffffff?text=' + product.name.substring(0, 20)} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300/2874f0/ffffff?text=' + product.name.substring(0, 20);
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 truncate">{product.name}</h3>
                <p className="text-2xl font-bold text-flipkart-blue mb-2">₹{product.price}</p>
                <p className="text-gray-600 text-sm mb-4">
                  {product.description.substring(0, 100)}...
                </p>
                <button 
                  className="w-full bg-yellow-400 text-flipkart-dark px-4 py-2 rounded font-semibold hover:bg-yellow-500"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;