import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CountryDropdown, RegionDropdown, CityDropdown } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import useRazorpay from "react-razorpay";

const Checkout = () => {
  const navigate = useNavigate();
  const [Razorpay] = useRazorpay();
  const [cart, setCart] = useState({ items: [] });
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    isDefault: false,
  });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch cart
        const cartResponse = await fetch("https://mahesh-gems-api.vercel.app/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartData = await cartResponse.json();
        setCart(cartData);

        // Fetch user
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);

        // Fetch addresses
        const addressResponse = await fetch("https://mahesh-gems-api.vercel.app/api/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const addressData = await addressResponse.json();
        setAddresses(addressData);
        const defaultAddress = addressData.find((addr) => addr.isDefault);
        if (defaultAddress) setSelectedAddress(defaultAddress._id);
      } catch (err) {
        setError("Failed to load data.");
      }
    };
    fetchData();
  }, [navigate]);

  // Handle address selection
  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  // Handle new address input
  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Handle country, state, city selection
  const handleLocationChange = (type, value) => {
    setNewAddress((prev) => ({
      ...prev,
      [type]: value.name || value,
    }));
  };

  // Add new address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://mahesh-gems-api.vercel.app/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAddress),
      });
      const data = await response.json();
      if (response.ok) {
        setAddresses([...addresses, data.address]);
        setNewAddress({
          name: "",
          street: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
          phone: "",
          isDefault: false,
        });
        setShowAddAddress(false);
        setSuccess("Address added successfully.");
      } else {
        setError(data.message || "Failed to add address.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Proceed to payment
  const handleCheckout = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!selectedAddress) {
      setError("Please select a shipping address.");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://mahesh-gems-api.vercel.app/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ addressId: selectedAddress }),
      });
      const data = await response.json();
      if (response.ok) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: "Mahesh Gems",
          description: "Jewelry Order Payment",
          order_id: data.razorpayOrderId,
          handler: async (response) => {
            try {
              const verifyResponse = await fetch("https://mahesh-gems-api.vercel.app/api/verify-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyResponse.json();
              if (verifyResponse.ok) {
                setSuccess("Payment successful! Order placed.");
                setTimeout(() => navigate("/orders"), 2000);
              } else {
                setError(verifyData.message || "Payment verification failed.");
              }
            } catch (err) {
              setError("Payment verification failed.");
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: addresses.find((addr) => addr._id === selectedAddress)?.phone || "",
          },
          notes: {
            address: "Mahesh Gems Corporate Office",
          },
          theme: {
            color: "#FFD700",
          },
        };

        const rzpay = new Razorpay(options);
        rzpay.open();
      } else {
        setError(data.message || "Failed to create order.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total
  const totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container min-h-screen px-4 mx-auto mt-6 font-montserrat">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Checkout</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Order Summary */}
        <div className="col-span-2 p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Order Summary</h2>
          {cart.items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div>
              {cart.items.map((item) => (
                <div key={item.jewelryId} className="flex items-center pb-4 mb-4 border-b">
                  <img src={item.image} alt={item.title} className="object-cover w-20 h-20 mr-4 rounded" />
                  <div>
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <p className="text-gray-500">₹{item.price} x {item.quantity}</p>
                    <p className="text-gray-500">Total: ₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 text-right">
                <p className="text-xl font-bold">Total: ₹{totalAmount}</p>
              </div>
            </div>
          )}
        </div>

        {/* Shipping Address */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Shipping Address</h2>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          {success && <p className="mb-4 text-sm text-green-500">{success}</p>}

          {/* Address Selection */}
          <select
            value={selectedAddress}
            onChange={handleAddressChange}
            className="w-full p-2 mb-4 border rounded-md"
            aria-label="Select shipping address"
          >
            <option value="">Select an address</option>
            {addresses.map((addr) => (
              <option key={addr._id} value={addr._id}>
                {addr.name}, {addr.street}, {addr.city}, {addr.state}, {addr.country} {addr.postalCode}
              </option>
            ))}
          </select>

          {/* Add New Address */}
          <button
            onClick={() => setShowAddAddress(!showAddAddress)}
            className="mb-4 text-sm text-blue-600 hover:underline"
          >
            {showAddAddress ? "Cancel" : "Add New Address"}
          </button>

          {showAddAddress && (
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={newAddress.name}
                  onChange={handleNewAddressChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={newAddress.street}
                  onChange={handleNewAddressChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Country</label>
                <CountryDropdown
                  value={newAddress.country}
                  onChange={(val) => handleLocationChange("country", val)}
                  classes="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">State</label>
                <RegionDropdown
                  country={newAddress.country}
                  value={newAddress.state}
                  onChange={(val) => handleLocationChange("state", val)}
                  classes="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">City</label>
                <CityDropdown
                  country={newAddress.country}
                  state={newAddress.state}
                  value={newAddress.city}
                  onChange={(val) => handleLocationChange("city", val)}
                  classes="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={newAddress.postalCode}
                  onChange={handleNewAddressChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={newAddress.phone}
                  onChange={handleNewAddressChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress((prev) => ({ ...prev, isDefault: e.target.checked }))}
                    className="mr-2"
                  />
                  Set as default address
                </label>
              </div>
              <button
                type="submit"
                className="w-full p-2 text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Address"}
              </button>
            </form>
          )}

          {/* Proceed to Payment */}
          <button
            onClick={handleCheckout}
            className="w-full p-2 mt-4 text-white bg-yellow-600 rounded-md hover:bg-yellow-700 disabled:opacity-50"
            disabled={isLoading || !selectedAddress}
          >
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;