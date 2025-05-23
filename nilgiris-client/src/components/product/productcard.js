import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios';
import { toast } from 'react-hot-toast';
import HashLoader from 'react-spinners/HashLoader';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [buttonText, setButtonText] = useState("Add to bag");
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  const { updateCartCount } = useCart();

  const addtocart = () => {
    if (!selectedVariant) {
      toast.error('No variant selected');
      return;
    }

    setAddingToCart(true);
    localStorage.removeItem('cartCount');
    axiosInstance.post('/carts/add', {
      product_id: product.id,
      variant_id: selectedVariant.id,
      quantity,
    })
      .then(response => {
        console.log(response.data);
        setButtonText("Added to Cart");
        setIsAdded(true);
        updateCartCount();
        toast.success('Added to cart successfully!');
        
        // Reset the button text after 3 seconds
        setTimeout(() => {
          setButtonText("Add to Bag");
          setIsAdded(false);
        }, 3000);
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add to cart');
      })
      .finally(() => {
        setAddingToCart(false);
      });
  };

  const handleBuyNow = () => {
    try {
      setBuyingNow(true);
      
      // Create a temporary order item for checkout
      const singleItem = {
        product: product,
        product_id: product.id,
        variant_id: selectedVariant.id,
        quantity: quantity,
        id: Date.now().toString() // Temporary ID
      };
      
      // Store the single item in session storage
      sessionStorage.setItem('buyNowItem', JSON.stringify(singleItem));
      
      // Navigate to checkout
      navigate('/checkout?buyNow=true');
    } catch (error) {
      console.error('Error proceeding to checkout:', error);
      toast.error('Failed to proceed to checkout');
    } finally {
      setBuyingNow(false);
    }
  };

  const handleVariantChange = (e) => {
   
    const variant = product.variants.find(v => v.id == e.target.value);
    if (variant) {


      setSelectedVariant(variant);
    }
  };

  const increment = () => {
    setQuantity(prev => prev + 1);
  };

  const decrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-xl p-4">
      <Link to={`/product/${product.id}`}>
        <div className="relative pb-[75%] mb-4">
          <img
            src={product?.images[0]}
            alt={product?.name}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-[#2E7D32] text-2xl font-medium">{product?.name}</h3>
            <p className="text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">{product?.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <p className="font-bold">₹{selectedVariant ? selectedVariant.price : 'N/A'}</p>
            {selectedVariant && selectedVariant.mrp > selectedVariant.price && (
              <p className="text-gray-500 line-through">₹{selectedVariant.mrp}</p>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-4">
          <select
            className="flex-grow p-3 bg-gray-100 rounded-lg border-none focus:ring-0"
            value={selectedVariant ? selectedVariant.id : ''}
            onChange={handleVariantChange}
          >
            {product.variants
              .filter(variant => variant.is_active)
              .map(variant => (
                <option key={variant.id} value={variant.id}>
                  {variant.name}
                </option>
              ))}
          </select>

          <div className="flex items-center bg-gray-100 rounded-lg">
            <button onClick={decrement} className="px-4 py-3 text-gray-600 hover:text-gray-800">−</button>
            <input
              type="number"
              className="w-12 bg-transparent text-center border-none focus:ring-0"
              value={quantity}
              readOnly
            />
            <button onClick={increment} className="px-4 py-3 text-gray-600 hover:text-gray-800">+</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={addtocart}
            disabled={addingToCart}
            className="bg-[#86B84E] text-white py-3 rounded-lg text-lg font-medium hover:bg-[#76a343] transition duration-200"
          >
            {addingToCart ? (
              <div className="flex items-center justify-center">
                <HashLoader color="#ffffff" size={24} />
              </div>
            ) : isAdded ? (
              <span>&#10003; {buttonText}</span>
            ) : (
              "Add to bag"
            )}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={buyingNow}
            className="bg-[#2E7D32] text-white py-3 rounded-lg text-lg font-medium hover:bg-[#1B5E20] transition duration-200"
          >
            {buyingNow ? (
              <div className="flex items-center justify-center">
                <HashLoader color="#ffffff" size={20} />
              </div>
            ) : (
              "Buy Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
