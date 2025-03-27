import React from 'react';


const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col">
    
      <div className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <div className="prose max-w-none">
          <p className="mb-4">
            Welcome to Aura Nutri. By accessing or using our website, you agree to abide by the following terms and conditions. Please read them carefully before proceeding.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">General Terms</h2>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              By using our website, you confirm that you are at least 18 years old or accessing the website under the supervision of a parent or guardian.
            </li>
            <li className="mb-2">
              The content on this website, including text, graphics, logos, images, and software, is the exclusive property of Aura Nutri. Unauthorized use is strictly prohibited.
            </li>
            <li className="mb-2">
              Aura Nutri reserves the right to refuse service, terminate accounts, or cancel orders at its sole discretion.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">User Responsibilities</h2>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              You are responsible for maintaining the confidentiality of your account information, including your username and password.
            </li>
            <li className="mb-2">
              Any false, inaccurate, or incomplete information provided by you may result in the suspension of your account.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4">Liability Disclaimer</h2>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              Aura Nutri is not liable for any damages arising out of the use or inability to use this website.
            </li>
            <li className="mb-2">
              We are not responsible for any delay or failure in performance caused by circumstances beyond our reasonable control.
            </li>
          </ul>
        </div>
      </div>
     
    </div>
  );
};

export default TermsAndConditions; 