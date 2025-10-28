import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      title: "Mega Sale! Up to 70% Off",
      subtitle: "On Electronics & Fashion",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop",
      bgColor: "from-purple-600 to-blue-600",
      cta: "Shop Now",
      link: "/products"
    },
    {
      id: 2,
      title: "New Arrivals Just In!",
      subtitle: "Latest Trends & Styles",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
      bgColor: "from-pink-500 to-orange-500",
      cta: "Explore",
      link: "/products"
    },
    {
      id: 3,
      title: "Super Saver Deals",
      subtitle: "Best Prices Guaranteed",
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=400&fit=crop",
      bgColor: "from-green-500 to-teal-500",
      cta: "View Deals",
      link: "/products"
    },
    {
      id: 4,
      title: "Premium Collection",
      subtitle: "Exclusive Products",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=400&fit=crop",
      bgColor: "from-indigo-600 to-purple-600",
      cta: "Discover",
      link: "/products"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleCTAClick = (link) => {
    navigate(link);
  };

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-xl shadow-2xl mb-8">
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 translate-x-0'
                : index < currentSlide
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-90`}></div>
            
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            />

            <div className="relative h-full flex items-center justify-center text-center px-4">
              <div className="max-w-3xl">
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg animate-fade-in">
                  {slide.title}
                </h2>
                <p className="text-2xl md:text-3xl text-white mb-8 drop-shadow-md">
                  {slide.subtitle}
                </p>
                <button 
                  onClick={() => handleCTAClick(slide.link)}
                  className="bg-yellow-400 text-flipkart-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-500 transform hover:scale-105 transition-all duration-200 shadow-xl cursor-pointer"
                >
                  {slide.cta} →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110 group"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 hover:scale-110 group"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'bg-white w-8 h-3'
                : 'bg-white/50 hover:bg-white/75 w-3 h-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
};

export default Carousel;
