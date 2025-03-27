import React, { useState, useEffect } from "react";
import axiosInstance from '../../axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filterDays, setFilterDays] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Fetch orders
    axiosInstance.get('/orders')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  // Filter orders based on selected criteria
  const filteredOrders = orders.filter(order => {
    let passesDateFilter = true;
    if (filterDays !== 'all') {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(filterDays));
      passesDateFilter = new Date(order.created_at) >= daysAgo;
    }

    let passesStatusFilter = true;
    if (filterStatus !== 'all') {
      passesStatusFilter = order.status.toLowerCase() === filterStatus.toLowerCase();
    }

    return passesDateFilter && passesStatusFilter;
  });

  return (
    <div className="container mx-auto py-4 sm:py-6 px-4 sm:px-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
        <div className="relative w-full sm:w-[160px]">
          <select 
            value={filterDays}
            onChange={(e) => setFilterDays(e.target.value)}
            className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value="all">All Orders</option>
            <option value="30">Last 30 Days</option>
            <option value="60">Last 60 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        <div className="relative w-full sm:w-[160px]">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value="all">All Status</option>
            <option value="delivered">Delivered</option>
            <option value="processing">Processing</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-lg">
        <div className="w-full">
          <div className="bg-gray-100">
            <div className="hidden sm:grid sm:grid-cols-5 gap-4 p-4">
              <div className="font-semibold text-left">Order Number</div>
              <div className="font-semibold text-left">Date</div>
              <div className="font-semibold text-left">Status</div>
              <div className="font-semibold text-left">Order Summary</div>
              <div className="font-semibold text-right">Actions</div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div key={order.id} className="flex flex-col sm:grid sm:grid-cols-5 gap-2 sm:gap-4 p-4">
                <div className="flex justify-between sm:block">
                  <div className="font-medium sm:hidden">Order:</div>
                  <div className="font-medium">{order.id}</div>
                </div>
                <div className="flex justify-between sm:block">
                  <div className="font-medium sm:hidden">Date:</div>
                  <div>{new Date(order.created_at).toLocaleDateString()}</div>
                </div>
                <div className="flex justify-between sm:block items-center">
                  <div className="font-medium sm:hidden">Status:</div>
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </div>
                </div>
                <div className="flex justify-between sm:block">
                  <div className="font-medium sm:hidden">Summary:</div>
                  <div className="space-y-1">
                    <div className="text-sm">Total Amount: ₹{order.total_amount?.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex justify-center sm:justify-end mt-2 sm:mt-0">
                  <a href={`/orderitems/${order.id}`} className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}