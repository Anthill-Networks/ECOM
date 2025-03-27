import React, { useState, useEffect } from "react";
import axiosInstance from '../../axios';
import OrderDetailsModal from './OrderDetailsModal';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [filterDays, setFilterDays] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleOrderClick = async (order) => {
    setSelectedOrder(order);
    try {
      const response = await axiosInstance.get(`/orders/${order.id}`);
      setOrderItems(response.data.items);
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

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
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <select 
          value={filterDays}
          onChange={(e) => setFilterDays(e.target.value)}
          className="rounded-lg border-gray-300 text-sm"
        >
          <option value="all">All Time</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border-gray-300 text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="block sm:hidden">
          {filteredOrders.map((order) => (
            <div key={order.id} className="p-4 border-b">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">#{order.id}</span>
                <span className="text-sm">₹{order.total_amount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">{order.status}</span>
                <span className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => handleOrderClick(order)}
                className="w-full text-center text-green-600 hover:text-green-900 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-green-600 text-sm font-medium transition-colors duration-200"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">₹{order.total_amount?.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{order.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleOrderClick(order)}
                      className="text-green-600 hover:text-green-900 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-green-600 text-sm font-medium transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          orderItems={orderItems}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}