import React from 'react';


const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Refund and Shipping Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cancellation Policy</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Orders can be canceled within 24 hours of placement or before shipment, whichever comes first.</li>
            <li>To cancel an order, contact us at support@auranutri.com</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refund Policy</h2>
          <p className="mb-2">Refunds are applicable for:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Damaged or defective products</li>
            <li>Incorrect items delivered</li>
          </ul>
          <p className="mb-2">Important points:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Refund requests must be initiated within 7 days of delivery</li>
            <li>Refunds will be processed within 5-7 working days after approval</li>
            <li>Refunds will be credited back to the original payment method or bank account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Pricing in INR</h2>
          <p className="mb-4">
            All prices on our website are listed in Indian Rupees (INR) and include applicable taxes. 
            Pricing may vary based on promotions, discounts, or changes in market conditions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Shipping Policy</h2>
          <h3 className="text-xl font-semibold mb-2">Shipping Timeline</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Orders are processed within 1-2 business days</li>
            <li>Delivery takes 5-10 business days depending on your location</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Shipping Charges</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Free Shipping: Orders above ₹500</li>
            <li>Standard Shipping: ₹50 for orders below ₹500</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Shipping Restrictions</h3>
          <p>
            We currently ship only within India. Remote locations may require additional delivery time.
          </p>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy; 