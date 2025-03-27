import React, { useState, useEffect } from 'react';
import { Minus, Plus, Star } from 'lucide-react';
import hero1 from "./../images/home/hero1.png";
import Footer from '../components/footer/footer';
import Header from '../components/navbar/header';
import Nav from '../components/navbar/nav';
import ProductDetailsHeader from '../components/product/ProductDetailsHeader';
import RelatedProducts from '../components/product/RelatedProducts';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';
import { readProducts } from '../firebase/productService';
import { toast } from 'react-hot-toast';
import { addProductReview, getProductReviews } from '../firebase/productService';
import HashLoader from 'react-spinners/HashLoader';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';

export default function ProductShowcase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateCartCount } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { settings, loading: settingsLoading } = useSettings();

  useEffect(() => {
    // Check if user is logged in by looking for auth token
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const fetchData = async () => {
      const [productData, reviewsData] = await Promise.all([
        readProducts(id),
        getProductReviews(id)
      ]);
      
      setProduct(productData);
      setSelectedVariant(productData?.variants[0] || null);
      setReviews(reviewsData);
      setLoading(false);
    };

    fetchData().catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    const images = product?.images || [];
    setProductImages(images);
    setSelectedImageIndex(0);
  }, [product]);

  const addtocart = async () => {
    try {
      setAddingToCart(true);
      //delete local storage
      updateCartCount();
      const response = await axiosInstance.post('/carts/add', {
        product_id: product.id,
        variant_id: selectedVariant.id,
        quantity: quantity
      });
      console.log(response.data);
      toast.success('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  }

  const nextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex - 1 + productImages.length) % productImages.length);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }

    try {
      const username = localStorage.getItem('username') || 'Anonymous';
      await addProductReview(id, {
        ...newReview,
        user_name: username
      });
      
      // Refresh reviews
      const updatedReviews = await getProductReviews(id);
      setReviews(updatedReviews);
      
      // Reset form
      setNewReview({ rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  if (loading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <HashLoader color="#36d7b7" />
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Nav />
      <ProductDetailsHeader 
        title="Product Details"
        breadcrumbs={[
          { text: 'Home' , link: '/' },
          { text: 'Product Details' , link: `/product/${id}` }
        ]}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 lg:mx-[15%]">Product Details</h1>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden lg:mx-[10%]">
          <div className="grid md:grid-cols-2 gap-8 p-4 sm:p-6 lg:p-8">
            {/* Product Images Section */}
            <div className="space-y-4">
              <div className="relative pb-[75%]">
                <button 
                  onClick={prevImage} 
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
                  aria-label="Previous image"
                >
                  &lt;
                </button>
                <img
                  src={productImages[selectedImageIndex] || hero1}
                  alt={`${product?.name} product image`}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                />
                <button 
                  onClick={nextImage} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
                  aria-label="Next image"
                >
                  &gt;
                </button>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg transition-all ${
                      selectedImageIndex === index ? 'ring-2 ring-green-500' : 'hover:opacity-75'
                    }`}
                  >
                    <img
                      src={productImages[index] || hero1}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="space-y-6">
              <div>
                <h2 className='text-2xl sm:text-3xl font-bold text-gray-900'>{product?.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-2xl font-semibold text-green-600">
                    ₹{selectedVariant?.price}
                  </p>
                  {selectedVariant?.mrp > selectedVariant?.price && (
                    <p className="text-lg text-gray-500 line-through">
                      ₹{selectedVariant?.mrp}
                    </p>
                  )}
                </div>
              </div>

              {product?.variants?.length > 0 && (
                <div>
                  <label htmlFor="variant-options" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Variant
                  </label>
                  <select
                    id="variant-options"
                    value={selectedVariant?.id}
                    onChange={(e) => {
                      const selected = product?.variants.find(v => v.id === e.target.value);
                      setSelectedVariant(selected);
                    }}
                    className="w-full sm:w-2/3 border-2 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {product?.variants?.map((v) => (
                      <option key={v?.id} value={v?.id}>{v?.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="inline-flex items-center border-2 rounded-md">
                  <button 
                    className="p-3 hover:bg-gray-100 transition-colors" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button 
                    className="p-3 hover:bg-gray-100 transition-colors" 
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button 
                onClick={addtocart}
                disabled={addingToCart}
                className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
              >
                {addingToCart ? (
                  <HashLoader color="#ffffff" size={24} />
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-12 bg-[#F1F8E9] rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("description")}
                className={`
                  flex-1 sm:flex-none px-6 py-4 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === "description" 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 sm:flex-none px-6 py-4 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === "reviews" ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Reviews ({reviews.length})
              </button>
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-gray-600">
                {product?.description}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Review Form - Only show if logged in */}
                {isLoggedIn ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rating</label>
                      <div className="flex items-center space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className={`${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            <Star className="h-6 w-6 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Comment</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        rows="4"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Submit Review
                    </button>
                  </form>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-md">
                    <p>Please <button onClick={() => navigate('/login')} className="text-green-600 hover:underline">login</button> to submit a review</p>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-4">
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">
                            {review.timestamp && new Date(review.timestamp.toDate()).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                        <p className="text-sm text-gray-500 mt-1">By {review.user_name}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No reviews yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <RelatedProducts currentProduct={product} />
      <Footer />
    </div>
  );
}
