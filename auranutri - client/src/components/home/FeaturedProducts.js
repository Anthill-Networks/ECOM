import React, { useEffect, useState } from "react";
import ProductCard from "./../product/productcard";
import axiosInstance from "../../axios";
import { getAllProducts } from "../../firebase/productService";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getAllProducts()
      .then(response => {
        const allProducts = response;
        const featuredProducts = allProducts.filter(product => product.is_featured);
        const shuffledProducts = featuredProducts.sort(() => 0.5 - Math.random());
        const selectedProducts = shuffledProducts.slice(0, 4); // Limit to 4 products
        setProducts(selectedProducts);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleSwipe = (direction) => {
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    }
  };

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <p className="text-[#0d2946]  text-lg">What's New?</p>
        <h2 className="text-3xl md:text-4xl font-bold josefin-sans-heading text-[#0d2946]  mb-6">
          Featured Products
        </h2>
        
        {/* Mobile view (1 product) */}
        <div className="sm:hidden relative">
          <div className="flex items-center justify-center">
            <button 
              onClick={() => handleSwipe('prev')}
              className="absolute left-0 z-10 bg-white/80 rounded-full p-2 shadow-lg"
              aria-label="Previous product"
            >
              &lt;
            </button>
            
            {products[currentIndex] && (
              <div className="w-full max-w-xs mx-auto" key={products[currentIndex].id || currentIndex}>
                <ProductCard product={products[currentIndex]} />
              </div>
            )}
            
            <button 
              onClick={() => handleSwipe('next')}
              className="absolute right-0 z-10 bg-white/80 rounded-full p-2 shadow-lg"
              aria-label="Next product"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Tablet and Desktop view (single row) */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
