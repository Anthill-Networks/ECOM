import React, { useEffect, useState } from "react";
import ProductCard from "./productcard";
import { getAllProducts } from "../../firebase/productService";

export default function RelatedProducts({ currentProduct }) {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!currentProduct) return;

    getAllProducts()
      .then(response => {
        // Filter products by same category and exclude current product
        const relatedProducts = response.filter(product => 
          product.category === currentProduct.category && 
          product.id !== currentProduct.id
        );
        
        // Shuffle and limit to 4 products
        const shuffledProducts = relatedProducts
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
          
        setProducts(shuffledProducts);
      })
      .catch(error => {
        console.error('Error fetching related products:', error);
      });
  }, [currentProduct]);

  const handleSwipe = (direction) => {
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold josefin-sans-heading text-[#2c6343] text-center mb-6">
          Related Products
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
              <div className="w-full max-w-xs mx-auto">
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

        {/* Tablet and Desktop view (grid) */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 