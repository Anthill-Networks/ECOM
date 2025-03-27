import React, { useState } from 'react';
import { Mail, Phone, MapPin } from "lucide-react";
import Footer from '../components/footer/footer';
import Nav from '../components/navbar/nav';
import Header from '../components/navbar/header';
import img from '../images/contact/image.png';
import { createEnquiry } from '../firebase/Enquireform';
import { useSettings } from '../context/SettingsContext';

export default function ContactPage() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEnquiry(formData);
      alert('Enquiry submitted successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Failed to submit enquiry. Please try again.');
    }
  };

  return (
    <>  
      <Header />
      <Nav />
      <div className="container mx-auto lg:mx-[15%] w-[85%] px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Information About Us</h2>
              <p className="text-gray-600 mb-4">
                Welcome to {settings?.storeName || 'our store'}. We're dedicated to providing 
                you with the finest quality products and exceptional service.
              </p>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Your Name" 
                    className="border rounded p-2 w-full" 
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Your Email" 
                    className="border rounded p-2 w-full" 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <input 
                  type="text" 
                  name="subject"
                  placeholder="Subject" 
                  className="border rounded p-2 w-full" 
                  value={formData.subject}
                  onChange={handleChange}
                />
                <textarea 
                  name="message"
                  placeholder="Type Your Message" 
                  rows={4} 
                  className="border rounded p-2 w-full" 
                  value={formData.message}
                  onChange={handleChange}
                />
                <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded">
                  Send Mail
                </button>
              </form>
            </section>
          </div>
          <div className="md:w-1/2">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Contact Way</h2>
              <div className="space-y-4">
                {settings?.email && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Mail className="text-purple-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-600">{settings.email}</p>
                    </div>
                  </div>
                )}
                
                {settings?.phoneNumber && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                      <Phone className="text-pink-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-gray-600">{settings.phoneNumber}</p>
                    </div>
                  </div>
                )}
                
                {settings?.address && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <MapPin className="text-teal-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-gray-600">{settings.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
            <div className="relative">
              <img
                src={img}
                alt="People working at computer"
                className="w-[50%] rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}