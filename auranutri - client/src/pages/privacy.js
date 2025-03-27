import React from 'react';


const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="mb-4">
            At Aura Nutri, we value your privacy and are committed to protecting your personal information.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">Information We Collect</h2>
          <h3 className="text-xl font-semibold mb-2">Personal Information:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Payment details</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Non-Personal Information:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Browser type</li>
            <li>IP address</li>
            <li>Browsing behavior</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>To process your orders and provide customer support</li>
            <li>To send promotional emails (only with your consent)</li>
            <li>To improve website functionality and enhance user experience</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">Information Sharing</h2>
          <p className="mb-4">
            We do not sell or rent your personal information. Your data is shared only with trusted partners required for order processing (e.g., delivery services).
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">Cookies</h2>
          <p className="mb-4">
            Our website uses cookies to collect information and provide a seamless browsing experience. You can disable cookies in your browser settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 