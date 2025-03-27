import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter } from 'lucide-react';
import Header from '../components/navbar/header';
import Nav from '../components/navbar/nav';
import ProductDetailsHeader from '../components/product/ProductDetailsHeader';
import Footer from '../components/footer/footer';
import axiosInstance from '../axios';
import ProductCard from '../components/product/productcard';
import { getAllProducts } from '../firebase/productService';
import { getAllCategory } from '../firebase/CategoryService';

export default function Products() {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    getAllCategory().then((response) => {
      setCategories(response);
    });

    getAllProducts().then((response) => {
      setProducts(response);
    });
  }, []);

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.discounted_price >= priceRange[0] && product.discounted_price <= priceRange[1];
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category_id);
    return matchesSearch && matchesPrice && matchesCategory;
  });

  return (
    <>
      <Header />
      <Nav />
      <ProductDetailsHeader 
        title="Products"
        breadcrumbs={[
          { text: 'Home' , link: '/' },
          { text: 'Products' , link: '/products' }
        ]}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-auto pl-10 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            className="md:hidden p-2 border rounded-lg hover:bg-gray-50"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <Filter className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden md:block md:w-1/4">
            <div className="sticky top-4 space-y-6 bg-white rounded-lg shadow-sm p-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Product Category</h2>
                <div className="space-y-3">
                  {categories?.map((category) => (
                    <label key={category.id} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input
                        type="checkbox"
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-3 text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Price Range</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">₹{priceRange[0]}</span>
                    <span className="text-sm text-gray-600">₹{priceRange[1]}</span>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min={0}
                      max={1000}
                      step={10}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full accent-green-600"
                    />
                    <input
                      type="range"
                      min={0}
                      max={1000}
                      step={10}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-green-600"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 block mb-1">Min</label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 block mb-1">Max</label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile filter drawer */}
          <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
            <div className="h-full overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Product Category</h2>
                  <div className="space-y-3">
                    {categories?.map((category) => (
                      <label key={category.id} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                        <input
                          type="checkbox"
                          id={`mobile-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryChange(category.id)}
                          className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-3 text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold mb-4">Price Range</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">₹{priceRange[0]}</span>
                      <span className="text-sm text-gray-600">₹{priceRange[1]}</span>
                    </div>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min={0}
                        max={1000}
                        step={10}
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full accent-green-600"
                      />
                      <input
                        type="range"
                        min={0}
                        max={1000}
                        step={10}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full accent-green-600"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <label className="text-sm text-gray-600 block mb-1">Min</label>
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm text-gray-600 block mb-1">Max</label>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Latest Products</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 lg:gap-7 gap-2">
              {filteredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </main>
        </div>
      </div>
      
      {/* Overlay for mobile filter */}
      {isMobileFilterOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileFilterOpen(false)}
        />
      )}
      
      <Footer />
    </>
  );
}