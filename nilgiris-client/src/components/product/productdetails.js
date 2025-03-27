import React, { useState, useEffect } from 'react';
import { Minus, Plus, Heart } from 'lucide-react';
import hero1 from './../../images/home/hero1.png';
import hero2 from './../../images/home/hero1.png'; // Add more images as needed
import hero3 from './../../images/home/hero1.png';

export default function ProductDetails({ variants }) {
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState(variants[0].value); // Default to the first variant
  const [selectedImage, setSelectedImage] = useState(0);

  const productImages = [
    hero1,
    hero2,
    hero3,
  ];

  const variantDetails = {
    raw: { price: 7.00, images: [productImages[0]] },
    manuka: { price: 10.00, images: [productImages[1]] },
    acacia: { price: 8.00, images: [productImages[2]] },
  };

  const handleVariantChange = (value) => {
    setVariant(value);
    setSelectedImage(0); // Reset to the first image of the selected variant
  };

  useEffect(() => {
    // Ensure the variant is valid on mount
    if (!variants.some(v => v.value === variant)) {
      setVariant(variants[0].value);
    }
  }, [variants]);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="relative">
          <img
            src={variantDetails[variant].images[selectedImage]}
            alt={`Honey product image ${selectedImage + 1}`}
            className="w-full object-contain rounded-lg"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {variantDetails[variant].images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-20 h-20 rounded-md overflow-hidden ${
                selectedImage === index ? 'ring-2 ring-primary' : ''
              }`}
            >
              <img
                src={image}
                alt={`Honey product thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <h2 className="text-3xl font-bold">Honey</h2>
          <button className="p-2 border rounded-full">
            <Heart className="h-4 w-4" />
          </button>
        </div>
        <p className="text-2xl font-semibold">${variantDetails[variant].price.toFixed(2)}</p>
        <div className="space-y-4">
          <div>
            <label htmlFor="variant-options" className="block text-sm font-medium text-gray-700 mb-2">
              Variant
            </label>
            <div id="variant-options" className="flex flex-wrap gap-4">
              {variants.map((v) => (
                <div key={v.value}>
                  <input
                    type="radio"
                    id={v.value}
                    name="variant"
                    value={v.value}
                    checked={variant === v.value}
                    onChange={() => handleVariantChange(v.value)}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor={v.value}
                    className={`flex flex-col items-center justify-center w-16 h-16 border-2 rounded-md cursor-pointer peer-checked:border-primary ${v.color} hover:bg-opacity-80 transition-colors`}
                  >
                    <span className="text-xs font-semibold">{v.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
              Quantity:
            </label>
            <div className="flex items-center border rounded-md">
              <button
                className="p-2"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                className="p-2"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add to Cart</button>
          <button className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">Buy Now</button>
        </div>
      </div>
    </div>
  );
}
