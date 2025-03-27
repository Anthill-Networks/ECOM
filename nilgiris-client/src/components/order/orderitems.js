import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from '../../axios';

export default function OrderItems() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    // Fetch order details
    axiosInstance.get(`/orders/${orderNumber}`)
      .then(response => {
        setOrder(response.data);
        setOrderItems(response.data.items);
      })
      .catch(error => {
        console.error('Error fetching order details:', error);
      });
  }, [orderNumber]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Order Details - {order.id}</h1>
      </div>
      
      {/* Update the items mapping section */}
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <div className="w-full">
          <div className="bg-gray-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4">
              <div className="font-semibold text-left text-sm sm:text-base">Product</div>
              <div className="font-semibold text-right sm:text-left text-sm sm:text-base">Total</div>
              <div className="hidden sm:block font-semibold text-right text-sm sm:text-base">Actions</div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {orderItems.map((item) => (
              <div key={item.id} className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.product_name}
                      width={48}
                      height={48}
                      className="rounded-lg w-12 h-12 sm:w-16 sm:h-16"
                    />
                    <div>
                      <div className="font-medium text-sm sm:text-base">{item.product_name}</div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        Variant: {item.variant_name}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right sm:text-left text-sm sm:text-base">
                  ₹{item.discounted_price?.toFixed(2)}
                </div>
                <div className="col-span-2 sm:col-span-1 mt-2 sm:mt-0">
                  <div className="flex sm:justify-end gap-2">
                    <button className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                      View Details
                    </button>
                    <button className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                      Buy Again
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}