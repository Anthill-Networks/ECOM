import { useState } from 'react';

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the newsletter subscription
    console.log('Subscribing email:', email);
    // Reset the input field after submission
    setEmail('');
  };

  return (
    <div className="w-full  mx-auto px-4 py-12 bg-gradient-to-r from-green-400 to-blue-500">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Get Latest Update By Subscribe</h2>
        <p className="text-lg text-gray-600">Our Newsletter</p>
        {/* <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"> */}
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
          Get Started
        </button>
      {/* </form> */}
      </div>
     
    </div>
  );
}
