import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../axios";

export default function EditDetailsForm() {
  const [user, setUser] = useState({
    id: "",
    company_id: "",
    email: "",
    phone: "",
    name: "",
    address: {
      first_name: "",
      last_name: "",
      address: "",
      apartment: "",
      country: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/users_data");
        setUser(response.data);
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setUser((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("users_data", user);
      alert("Details updated successfully!");
    } catch (err) {
      setError("Failed to update user data.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-5xl lg:mt-10 lg:mb-10 mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Details</h1>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="text-sm font-medium">Mobile number :</label>
            <input
              id="phone"
              name="phone"
              value={user?.phone}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          
          <div>
            <label htmlFor="name" className="text-sm font-medium">Full name :</label>
            <input
              id="name"
              name="name"
              value={user?.name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email :</label>
            <input
              id="email"
              name="email"
              type="email"
              value={user?.email}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping address</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="first_name" className="text-sm font-medium">First Name :</label>
              <input
                id="first_name"
                name="address.first_name"
                value={user?.address?.first_name}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            
            <div>
              <label htmlFor="last_name" className="text-sm font-medium">Last Name :</label>
              <input
                id="last_name"
                name="address.last_name"
                value={user?.address?.last_name}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            
            <div>
              <label htmlFor="address" className="text-sm font-medium">Address :</label>
              <input
                id="address"
                name="address.address"
                value={user?.address?.address}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>

            <div>
              <label htmlFor="apartment" className="text-sm font-medium">Apartment :</label>
              <input
                id="apartment"
                name="address.apartment"
                value={user?.address?.apartment}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="country" className="text-sm font-medium">Country</label>
                <input
                  id="country"
                  name="address.country"
                  value={user?.address?.country}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>

              <div>
                <label htmlFor="state" className="text-sm font-medium">State</label>
                <input
                  id="state"
                  name="address.state"
                  value={user?.address?.state}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="text-sm font-medium">City</label>
                <input
                  id="city"
                  name="address.city"
                  value={user?.address?.city}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              
              <div>
                <label htmlFor="zip" className="text-sm font-medium">Zip Code</label>
                <input
                  id="zip"
                  name="address.zip"
                  value={user?.address?.zip}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded">
          Save details
        </button>
      </form>
    </div>
  );
}
