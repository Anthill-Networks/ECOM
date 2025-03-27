import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hero1 from "./../../images/home/hero1.png";

export default function Hero({ banners = { desktop: [], mobile: [] } }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  
  const slides = isMobile 
    ? (banners.mobile?.length > 0 ? banners.mobile : [hero1])
    : (banners.desktop?.length > 0 ? banners.desktop : [hero1]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleExplore = () => {
    navigate('/products');
  };

  return (
    <main className="flex-grow relative">
      <div className="h-screen overflow-hidden relative">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full transition-opacity duration-1000 h-full object-cover ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center">
          <div className="text-[#0d2946] p-8 md:p-12 max-w-xl md:ml-[10%]">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-left">
              Revitalize Naturally With Pure Ayurvedic Wellness
            </h1>
            <p className="mb-8 text-lg text-white text-left">
              Our products are more than just items—they are a promise of purity and wellness. 
              Sourced sustainably and crafted with care, each product in our collection embodies 
              the holistic principles of Ayurveda.
            </p>
            <button 
              onClick={handleExplore}
              className="bg-[#1B365D] text-white hover:bg-[#264b7e] px-8 py-3 rounded-full transition-colors duration-300"
            >
              Explore Now
            </button>
          </div>
        </div>

        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? "bg-white scale-110" 
                    : "bg-white bg-opacity-50 hover:bg-opacity-75"
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
