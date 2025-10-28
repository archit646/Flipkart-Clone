import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (parsed && Array.isArray(parsed)) {
          return parsed;
        } else if (parsed && Array.isArray(parsed.items)) {
          return parsed.items;
        }
      } catch (error) {
        console.log('error loading cart:', error);
      }
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product) => {
    const existingProduct = cartItems.find(item => item.id === product.id);
    
    if (existingProduct) {
      const updatedCart = cartItems.map(item => {
        if (item.id === product.id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
  };

  // Update item quantity in cart
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cartItems.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: quantity };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  // Clear all items from cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total cart price
  const getCartTotal = () => {
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
      total = total + (cartItems[i].price * cartItems[i].quantity);
    }
    return total;
  };

  // Get total number of items in cart
  const getCartCount = () => {
    let count = 0;
    for (let i = 0; i < cartItems.length; i++) {
      count = count + cartItems[i].quantity;
    }
    return count;
  };

  return (
    <CartContext.Provider
      value={{
        cart: { items: cartItems },
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};