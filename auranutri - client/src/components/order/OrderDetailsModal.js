import { X, Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

export default function OrderDetailsModal({ order, orderItems, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Order Details</h2>
          <div className="flex items-center gap-2 sm:gap-4">
            <PDFDownloadLink
              document={<InvoicePDF order={order} orderItems={orderItems} />}
              fileName={`invoice-${order.id}.pdf`}
              className="flex items-center gap-1 sm:gap-2 text-green-600 hover:text-green-700"
            >
              {({ loading }) => (
                loading ? 
                'Loading...' : 
                <>
                  <Download size={18} />
                  <span className="hidden sm:inline">Download Invoice</span>
                </>
              )}
            </PDFDownloadLink>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 120px)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6">
            {/* Order Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900">Order Information</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">#{order.id}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">₹{order.total_amount}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">{order.status}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{new Date(order.created_at).toLocaleString()}</span>
                </p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900">Shipping Information</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">
                    {order.address.first_name} {order.address.last_name}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{order.phone}</span>
                </p>
                <p className="text-gray-600">Address:</p>
                <p className="text-sm text-gray-800">
                  {order.address.apartment},<br />
                  {order.address.address},<br />
                  {order.address.city}, {order.address.state},<br />
                  {order.address.zip}, {order.address.country}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900">Order Items</h3>
            
            {/* Mobile view for order items */}
            <div className="block sm:hidden space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="border-b pb-4">
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-gray-500">{item.variant_name}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm">Qty: {item.quantity}</span>
                    <span className="text-sm">₹{item.discounted_price?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="font-medium">
                      Total: ₹{(item.quantity * item.discounted_price)?.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view for order items */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orderItems.map((item) => (
                    <tr key={item.id} className="bg-white">
                      <td className="px-4 py-3 text-sm text-gray-900">{item.product_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{item.variant_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 text-right">₹{item.discounted_price?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        ₹{(item.quantity * item.discounted_price)?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Total amount */}
        <div className="p-4 sm:p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-4 text-base sm:text-lg">
            <span className="font-semibold">Total Amount:</span>
            <span className="font-bold text-green-600">₹{order.total_amount?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 